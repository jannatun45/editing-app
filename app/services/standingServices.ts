const API_URL = "http://localhost:3000/api";

import type { Standing } from "~/types/api/standings";

// get standing
export async function getStandings(season: string): Promise<Standing[]> {
  const response = await fetch(
    `${API_URL}/standings?season=${encodeURIComponent(season)}`,
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || "Gagal mengambil standing");
  }

  const result = await response.json();

  return result.data;
}

// update score
// export async function updateMatchScore(
//   id: string,
//   homeScore: number,
//   awayScore: number,
// ) {
//   const response = await fetch(`${API_URL}/fixtures/${id}/score`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       home_score: homeScore,
//       away_score: awayScore,
//     }),
//   });

//   if (!response.ok) {
//     const error = await response.json();

//     throw new Error(error.message || "Gagal mengupdate score");
//   }

//   return response.json();
// }
