import type { Player } from "~/types/api/player";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

export interface PlayerFilters {
  page?: number;
  limit?: number;
  search?: string;
  club?: string;
  position?: string;
  national?: string;
  ageGroup?: string;
  season?: string;
  sort?: string;
}

export interface PlayerListResponse {
  data: Player[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta: {
    totalClubs: number;
    nationalities: string[];
    positions: {
      _id: string;
      count: number;
    }[];
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || `Request gagal (${response.status})`);
  }

  return result as T;
}

export async function getAllPlayers(
  filters: PlayerFilters = {},
): Promise<PlayerListResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== "all") {
      params.set(key, String(value));
    }
  });

  return request<PlayerListResponse>(`/players?${params.toString()}`);
}

export async function createPlayer(formData: FormData): Promise<Player> {
  const result = await request<{ data: Player }>("/players", {
    method: "POST",
    body: formData,
  });

  return result.data;
}

export async function updatePlayer(
  id: string,
  formData: FormData,
): Promise<Player> {
  const result = await request<{ data: Player }>(`/players/${id}`, {
    method: "PUT",
    body: formData,
  });

  return result.data;
}

export async function transferPlayer(
  id: string,
  clubId: string,
): Promise<Player> {
  const result = await request<{ data: Player }>(`/players/${id}/transfer`, {
    method: "PATCH",
    body: JSON.stringify({ clubId }),
  });

  return result.data;
}

export async function deletePlayer(id: string): Promise<void> {
  await request(`/players/${id}`, {
    method: "DELETE",
  });
}
// import type { Player } from "~/types/api/player";
// export type CreatePlayerPayload = {
//   club: string;
//   name_player: string;
//   number: number;
//   position: "GK" | "DF" | "MF" | "FW";
//   contract_expires?: string | null;
//   joined?: string | null;
//   national?: string | null;
//   market_value?: number | null;
//   date_of_birth?: string | null;
// };

// // create player
// export async function createPlayer(data: CreatePlayerPayload) {
//   const response = await fetch(`${API_URL}/players`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     const error = await response.json();

//     throw new Error(error.message || "Gagal menambahkan player");
//   }

//   const result = await response.json();

//   return result.data;
// }

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
