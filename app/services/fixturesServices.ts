import type { Match } from "~/types/api/matches";
const API_URL = import.meta.env.VITE_API_URL;

// Interface untuk input goal
export interface FixtureGoal {
  _id?: string;
  club: string;
  scorer: string;
  minute: number;
  assist: string | null;
}
// Update hasil pertandingan
export interface UpdateFixtureResultPayload {
  home_score: number;
  away_score: number;
  goals: FixtureGoal[];
}

// Update hasil pertandingan
export async function updateFixtureResult(
  fixtureId: string,
  payload: UpdateFixtureResultPayload,
) {
  const response = await fetch(`${API_URL}/fixture/${fixtureId}/result`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal memperbarui hasil pertandingan");
  }

  return data;
}

// Update jadwal pertandingan
export async function updateFixture(
  id: string,
  matchday: number,
  matchDate: string,
) {
  const response = await fetch(`${API_URL}/fixtures/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      matchday,
      match_date: matchDate,
    }),
  });
  // console.log("updateFixture response:", response);

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || "Gagal memperbarui jadwal");
  }

  const result = await response.json();

  return result.data;
}
// Update score pertandingan
export async function updateMatchScore(
  id: string,
  home_score: number,
  away_score: number,
) {
  const response = await fetch(`${API_URL}/fixtures/${id}/score`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      home_score,
      away_score,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal memperbarui score");
  }

  return data;
}

// update match
export async function updateMatch(
  id: string,
  matchday: number,
  matchDate: string,
) {
  const response = await fetch(`${API_URL}/fixtures/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchday, match_date: matchDate }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal memperbarui jadwal");
  }
  const result = await response.json();
  return result.data;
}

// Generate jadwal satu season
export async function generateMatches(season: string) {
  const response = await fetch(`${API_URL}/matches/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      season,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal membuat jadwal");
  }

  return data;
}

// reset fixture
// export async function resetFixtureResult(id: string) {
//   const response = await fetch(`${API_URL}/fixtures/${id}/reset`, {
//     method: "PUT",
//   });

//   if (!response.ok) {
//     const error = await response.json();

//     throw new Error(error.message || "Gagal mereset hasil pertandingan");
//   }

//   const result = await response.json();

//   return result.data;
// }
