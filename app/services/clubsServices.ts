// 2. API Club reference (module scope, useState, useQuery, etc.)

import type { Club } from "~/types/api/clubs";

export async function getClubs(): Promise<Club[]> {
  const response = await fetch("http://localhost:3000/api/club");
  if (!response.ok) {
    throw new Error("Gagal mengambil Products");
  }
  return response.json();
}
