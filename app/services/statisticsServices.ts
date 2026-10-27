const API_URL = import.meta.env.VITE_API_URL;

// export interface PlayerStatistic {
//   player: {
//     _id: string;
//     [key: string]: unknown;
//   };
//   club: {
//     _id: string;
//     name_club: string;
//     logo?: string | null;
//   };
//   goals?: number;
//   assists?: number;
// }
export interface PlayerStatistic {
  playerId: string;
  playerName: string;
  clubId: string;
  clubName: string;
  totalGoals: number;
  totalAssists?: number;
}

interface StatisticResponse {
  season: string;
  data: PlayerStatistic[];
}

async function fetchStatistics(
  endpoint: string,
  season: string,
): Promise<StatisticResponse> {
  const response = await fetch(
    `${API_URL}/${endpoint}?season=${encodeURIComponent(season)}`,
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil statistik pemain");
  }

  return response.json();
}

export function getTopScorers(season: string) {
  return fetchStatistics("top-scorers", season);
}

export function getTopAssists(season: string) {
  return fetchStatistics("top-assists", season);
}
