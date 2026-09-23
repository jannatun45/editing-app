const API_URL = "http://localhost:3000/api";

import type { Player } from "~/types/api/player";
export type CreatePlayerPayload = {
  club: string;
  name_player: string;
  number: number;
  position: "GK" | "DF" | "MF" | "FW";
  contract_expires?: string | null;
  joined?: string | null;
  national?: string | null;
  market_value?: number | null;
  date_of_birth?: string | null;
};

// create player
export async function createPlayer(data: CreatePlayerPayload) {
  const response = await fetch(`${API_URL}/players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || "Gagal menambahkan player");
  }

  const result = await response.json();

  return result.data;
}

// get player by club
export async function getPlayersByClub(clubId: string): Promise<Player[]> {
  const response = await fetch(`${API_URL}/players/club/${clubId}`);

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || "Gagal mengambil player");
  }

  const result = await response.json();

  return result.data;
}
