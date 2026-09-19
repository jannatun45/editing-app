// 2. API Club reference (module scope, useState, useQuery, etc.)

import type { Club } from "~/types/api/clubs";

export async function getClubs(): Promise<Club[]> {
  const response = await fetch("http://localhost:3000/api/club");
  if (!response.ok) {
    throw new Error("Gagal mengambil Clubs");
  }
  return response.json();
}

export async function createClubs(formData: FormData): Promise<Club[]> {
  const response = await fetch("http://localhost:3000/api/club", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Gagal membuat Club");
  }
  return response.json();
}

export async function getClub(id: string): Promise<Club> {
  // Ambil satu club berdasarkan ID
  const response = await fetch(`http://localhost:3000/api/club/${id}`);

  if (!response.ok) {
    throw new Error("Club tidak ditemukan");
  }

  return response.json();
}
