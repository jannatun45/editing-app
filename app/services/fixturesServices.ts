import type { Fixture } from "~/types/api/fixtures";

const API_URL = "http://localhost:3000/api";

export async function getClubFixtures(clubId: string): Promise<Fixture[]> {
  const response = await fetch(`${API_URL}/fixtures/club/${clubId}`);

  if (!response.ok) {
    throw new Error("Gagal mengambil jadwal club");
  }

  return response.json();
}
