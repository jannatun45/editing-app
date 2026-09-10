import type { Clubs } from "~/types/api/clubs";

export async function getClubs(): Promise<Clubs[]> {
  const response = await fetch("http://localhost:3000/api/clubs");
  if (!response.ok) {
    throw new Error("Gagal mengambil Products");
  }
  return response.json();
}
