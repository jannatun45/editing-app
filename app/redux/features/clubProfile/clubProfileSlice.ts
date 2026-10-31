import { createSlice } from "@reduxjs/toolkit";
import type { Club } from "~/types/api/clubs";
import type { GoalEvent } from "~/types/api/goalEvents";
import type { Match } from "~/types/api/matches";
import type { Player } from "~/types/api/player";
import type { Standing } from "~/types/api/standings";
import {
  fetchClubGoalEvents,
  fetchClubMatches,
  fetchClubPlayers,
  fetchClubProfile,
  removeMatch,
  resetClubMatch,
  saveClub,
  saveMatchScore,
} from "./clubProfileThunks";

// =========================
// STATE TYPE
// =========================
type ClubProfileState = {
  club: Club | null;
  standing: Standing | null;
  players: Player[];
  matches: Match[];
  goalEvents: GoalEvent[];

  loading: boolean;
  loadingPlayers: boolean;
  loadingFixtures: boolean;
  loadingGoals: boolean;
  saving: boolean;

  error: string;
  goalError: string;
  playerError: string;
  fixtureError: string;
};

const initialState: ClubProfileState = {
  club: null,
  standing: null,
  players: [],
  matches: [],
  goalEvents: [],

  loading: false,
  loadingPlayers: false,
  loadingFixtures: false,
  loadingGoals: false,
  saving: false,

  error: "",
  goalError: "",
  playerError: "",
  fixtureError: "",
};

// =========================
// SLICE
// =========================

const clubProfileSlice = createSlice({
  name: "clubProfile",
  initialState,
  reducers: {
    clearClubProfileError: (state) => {
      state.error = "";
    },
  },

  extraReducers: (builder) => {
    // =========================
    // FETCH CLUB PROFILE
    // =========================

    builder
      .addCase(fetchClubProfile.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchClubProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.club = action.payload.club;
        state.standing = action.payload.standing;
      })
      .addCase(fetchClubProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Gagal Mengambil Data Club Profile";
      });

    // =========================
    // FETCH PLAYERS
    // =========================

    builder
      .addCase(fetchClubPlayers.pending, (state) => {
        state.loadingPlayers = true;
        state.playerError = "";
      })
      .addCase(fetchClubPlayers.fulfilled, (state, action) => {
        state.loadingPlayers = false;
        state.players = action.payload;
      })
      .addCase(fetchClubPlayers.rejected, (state, action) => {
        state.loadingPlayers = false;
        state.playerError = action.payload ?? "Gagal mengambil pemain";
      });

    // =========================
    // FETCH MATCHES
    // =========================

    builder
      .addCase(fetchClubMatches.pending, (state) => {
        state.loadingFixtures = true;
        state.fixtureError = "";
      })
      .addCase(fetchClubMatches.fulfilled, (state, action) => {
        state.loadingFixtures = false;
        state.matches = action.payload;
      })
      .addCase(fetchClubMatches.rejected, (state, action) => {
        state.loadingFixtures = false;
        state.fixtureError = action.payload ?? "Gagal mengambil pertandingan";
      });

    // =========================
    // FETCH GOAL EVENTS
    // =========================

    builder
      .addCase(fetchClubGoalEvents.pending, (state) => {
        state.loadingGoals = true;
        state.goalError = "";
      })
      .addCase(fetchClubGoalEvents.fulfilled, (state, action) => {
        state.loadingGoals = false;
        state.goalEvents = action.payload;
      })
      .addCase(fetchClubGoalEvents.rejected, (state, action) => {
        state.loadingGoals = false;
        state.goalError = action.payload ?? "Gagal mengambil data gol";
      });

    // =========================
    // UPDATE CLUB
    // =========================

    builder
      .addCase(saveClub.pending, (state) => {
        state.saving = true;
        state.error = "";
      })
      .addCase(saveClub.fulfilled, (state, action) => {
        state.saving = false;
        state.club = action.payload;
      })
      .addCase(saveClub.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? "Gagal memperbarui club";
      });

    // =========================
    // UPDATE SCORE
    // =========================

    builder
      .addCase(saveMatchScore.pending, (state) => {
        state.saving = true;
        state.error = "";
      })
      .addCase(saveMatchScore.fulfilled, (state, action) => {
        state.saving = false;
        state.matches = action.payload.matches;
        state.standing = action.payload.standing;
        state.goalEvents = action.payload.goalEvents;
      })
      .addCase(saveMatchScore.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? "Gagal memperbarui pertandingan";
      });

    // =========================
    // DELETE MATCH
    // =========================

    builder
      .addCase(removeMatch.pending, (state) => {
        state.saving = true;
        state.error = "";
      })
      .addCase(removeMatch.fulfilled, (state, action) => {
        state.saving = false;
        state.matches = action.payload.matches;
        state.standing = action.payload.standing;
        state.goalEvents = action.payload.goalEvents;
      })
      .addCase(removeMatch.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? "Gagal menghapus pertandingan";
      });

    // =========================
    // RESET MATCH
    // =========================

    builder
      .addCase(resetClubMatch.pending, (state) => {
        state.saving = true;
        state.error = "";
      })
      .addCase(resetClubMatch.fulfilled, (state, action) => {
        state.saving = false;
        state.matches = action.payload.matches;
        state.standing = action.payload.standing;
        state.goalEvents = action.payload.goalEvents;
      })
      .addCase(resetClubMatch.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? "Gagal mereset pertandingan";
      });
  },
});

export const { clearClubProfileError } = clubProfileSlice.actions;

export default clubProfileSlice.reducer;
