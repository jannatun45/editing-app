import type { GoalEvent } from "~/types/api/goalEvents";

const API_URL = "http://localhost:3000/api/goal-events";

export async function getGoalEventsByClub(
  id: string,
  season: string,
): Promise<GoalEvent[]> {
  const params = new URLSearchParams({
    club: id,
    season,
  });

  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data Goal Event");
  }

  const result = await response.json();

  return result.data;
}

// import type { FixtureGoalInput } from "~/types/api/fixtures";

// const API_URL = "http://localhost:3000/api/goal-event";

// export const createGoalEvent = async (
//   fixtureId: string,
//   season: string,
//   goal: FixtureGoalInput,
// ) => {
//   const response = await fetch(API_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       fixture: fixtureId,
//       season,
//       club: goal.club,
//       player: goal.scorer,
//       assist: goal.assist || null,
//       minute: goal.minute,
//     }),
//   });

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.error || "Gagal membuat goal event");
//   }

//   return result;
// };
