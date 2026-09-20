import type { Match } from "~/types/api/matches";

const API_URL = "http://localhost:3000/api";

// Ambil semua pertandingan
export async function getMatches(season?: string): Promise<Match[]> {
  const url = season
    ? `${API_URL}/matches?season=${encodeURIComponent(season)}`
    : `${API_URL}/matches`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Gagal mengambil data pertandingan");
  }

  return response.json();
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

// Update score pertandingan
export async function updateMatchScore(
  id: string,
  home_score: number,
  away_score: number,
) {
  const response = await fetch(`${API_URL}/matches/${id}/score`, {
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
