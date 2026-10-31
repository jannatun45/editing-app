import type { CreateMatchInput } from "~/components/organisms/CreateMatchModal";
import type { Match, UpdateMatchScorePayload } from "~/types/api/matches";

const API_URL = import.meta.env.VITE_API_URL;

// DELETE MATCH / reset hasil pertandingan
export async function deleteMatch(id: string) {
  const response = await fetch(`${API_URL}/match/${id}`, {
    method: "DELETE",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Gagal mereset hasil pertandingan");
  }

  return result;
}
// Update jadwal pertandingan
export async function updateMatch(
  id: string,
  matchday: number,
  matchDate: string,
  posterFile?: File | null,
) {
  const formData = new FormData();

  formData.append("matchday", String(matchday));
  formData.append("match_date", matchDate);

  if (posterFile) {
    formData.append("poster", posterFile);
  }

  const response = await fetch(`${API_URL}/match/${id}`, {
    method: "PUT",
    body: formData,
    // Jangan tambahkan Content-Type: multipart/form-data secara manual.
    // Browser akan mengatur boundary secara otomatis.
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Gagal memperbarui jadwal");
  }

  return result.data;
}

// reset match
export async function resetMatch(id: string) {
  const response = await fetch(`${API_URL}/match/${id}/reset`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Gagal memperbarui jadwal");
  }

  return result.data;
}

// GET MATCHES / ambil semua pertandingan
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

// temukan pertandingan berdasarkan id
export async function getMatchById(id: string): Promise<Match> {
  const response = await fetch(`${API_URL}/match/${id}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil detail pertandingan");
  }

  return result.data;
}

// temukanjadwal pertandingan berdasarkan club
export async function getClubMatches(clubId: string): Promise<Match[]> {
  const response = await fetch(`${API_URL}/matches/club/${clubId}`);

  if (!response.ok) {
    throw new Error("Gagal mengambil jadwal club");
  }

  return response.json();
}

// UPDATE MATCH atau FIXTURE SCORE / update hasil pertandingan
export async function updateMatchScore(
  id: string,
  payload: UpdateMatchScorePayload,
) {
  const response = await fetch(`${API_URL}/matches/${id}/score`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // console.log Done data goals to be sent to the server / data goals sudah siap dikirim ke server
  // console.log("Response from updateMatchScore:", data);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal memperbarui hasil pertandingan");
  }

  return result.data;
}
// membuat pertandingan
export async function createMatch(data: CreateMatchInput) {
  const response = await fetch(`${API_URL}/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal membuat pertandingan");
  }

  return result.data;
}
