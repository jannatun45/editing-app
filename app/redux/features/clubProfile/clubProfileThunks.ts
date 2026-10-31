import { createAsyncThunk } from "@reduxjs/toolkit";
import { getClubById, updateClub } from "~/services/clubsServices";
import { getGoalEventsByClub } from "~/services/goalEventServices";
import {
  deleteMatch,
  getClubMatches,
  resetMatch,
  updateMatchScore,
} from "~/services/matchServices";
import { getPlayersByClub } from "~/services/playerServices";
import { getStandings } from "~/services/standingServices";
import type { Club } from "~/types/api/clubs";
import type { GoalEvent } from "~/types/api/goalEvents";
import type { Match, MatchGoalInput } from "~/types/api/matches";
import type { Player } from "~/types/api/player";
import type { Standing } from "~/types/api/standings";

const season = "2026/2027";

// Helper untuk menangani error
const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

// =========================
// FETCH CLUB PROFILE
// =========================

export const fetchClubProfile = createAsyncThunk<
  { club: Club; standing: Standing | null },
  string,
  { rejectValue: string }
>("clubProfile/fetchClubProfile", async (id, thunkApi) => {
  try {
    const [club, standings] = await Promise.all([
      getClubById(id),
      getStandings(season),
    ]);

    const standing = standings.find((item) => String(item.club._id)) ?? null;

    return { club, standing };
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Gagal Mengambil Data"),
    );
  }
});

// =========================
// FETCH PLAYERS
// =========================

export const fetchClubPlayers = createAsyncThunk<
  Player[],
  string,
  { rejectValue: string }
>("clubProfile/fetchClubPlayers", async (id, thunkAPI) => {
  try {
    return await getPlayersByClub(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Gagal mengambil data pemain"),
    );
  }
});

// =========================
// FETCH MATCHES
// =========================

export const fetchClubMatches = createAsyncThunk<
  Match[],
  string,
  { rejectValue: string }
>("clubProfile/fetchClubMatches", async (id, thunkAPI) => {
  try {
    return await getClubMatches(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Gagal mengambil jadwal pertandingan"),
    );
  }
});

// =========================
// FETCH GOAL EVENTS
// =========================

export const fetchClubGoalEvents = createAsyncThunk<
  GoalEvent[],
  { clubId: string; season: string },
  { rejectValue: string }
>("clubProfile/fetchClubGoalEvents", async ({ clubId, season }, thunkAPI) => {
  try {
    return await getGoalEventsByClub(clubId, season);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Gagal mengambil data gol"),
    );
  }
});

// =========================
// UPDATE CLUB
// =========================

export const saveClub = createAsyncThunk<
  Club,
  { id: string; formData: FormData },
  { rejectValue: string }
>("clubProfile/saveClub", async ({ id, formData }, thunkAPI) => {
  try {
    await updateClub(id, formData);

    return await getClubById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Gagal memperbarui club"),
    );
  }
});

// =========================
// REFRESH MATCH RELATED DATA
// =========================

async function refreshMatchData(clubId: string) {
  const [matches, standings, goalEvents] = await Promise.all([
    getClubMatches(clubId),
    getStandings(season),
    getGoalEventsByClub(clubId, season),
  ]);

  const standing = standings.find((item) => item.club._id === clubId) ?? null;

  return {
    matches,
    standing,
    goalEvents,
  };
}

// =========================
// UPDATE MATCH SCORE
// =========================

type SaveMatchScorePayload = {
  matchId: string;
  clubId: string;
  matchday: number;
  match_date: string;
  home_score: number;
  away_score: number;
  goals: MatchGoalInput[];
};

export const saveMatchScore = createAsyncThunk<
  Awaited<ReturnType<typeof refreshMatchData>>,
  SaveMatchScorePayload,
  { rejectValue: string }
>("clubProfile/saveMatchScore", async (payload, thunkAPI) => {
  try {
    const {
      matchId,
      clubId,
      matchday,
      match_date,
      home_score,
      away_score,
      goals,
    } = payload;

    await updateMatchScore(matchId, {
      matchday,
      match_date,
      home_score,
      away_score,
      goals,
    });

    return await refreshMatchData(clubId);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Gagal memperbarui pertandingan"),
    );
  }
});

// =========================
// DELETE MATCH
// =========================

type MatchActionPayload = {
  matchId: string;
  clubId: string;
};

export const removeMatch = createAsyncThunk<
  Awaited<ReturnType<typeof refreshMatchData>>,
  MatchActionPayload,
  { rejectValue: string }
>("clubProfile/removeMatch", async ({ matchId, clubId }, thunkAPI) => {
  try {
    await deleteMatch(matchId);

    return await refreshMatchData(clubId);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Gagal menghapus pertandingan"),
    );
  }
});

// =========================
// RESET MATCH
// =========================

export const resetClubMatch = createAsyncThunk<
  Awaited<ReturnType<typeof refreshMatchData>>,
  MatchActionPayload,
  { rejectValue: string }
>("clubProfile/resetClubMatch", async ({ matchId, clubId }, thunkAPI) => {
  try {
    await resetMatch(matchId);

    return await refreshMatchData(clubId);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Gagal mereset pertandingan"),
    );
  }
});
