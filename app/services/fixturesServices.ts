import type { Fixture } from "~/types/api/fixtures";

const API_URL = "http://localhost:3000/api";

export async function getClubFixtures(clubId: string): Promise<Fixture[]> {
  const response = await fetch(`${API_URL}/fixtures/club/${clubId}`);

  if (!response.ok) {
    throw new Error("Gagal mengambil jadwal club");
  }

  return response.json();
}

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

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || "Gagal memperbarui jadwal");
  }

  const result = await response.json();

  return result.data;
}
