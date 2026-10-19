// 2. API Club reference (module scope, useState, useQuery, etc.)

import type { Club } from "~/types/api/clubs";
const API_URL = import.meta.env.VITE_API_URL;

export async function getClubs(): Promise<Club[]> {
  const response = await fetch(`${API_URL}/club`);
  if (!response.ok) {
    throw new Error("Gagal mengambil Clubs");
  }
  return response.json();
}

export async function createClubs(formData: FormData): Promise<Club[]> {
  const response = await fetch(`${API_URL}/club`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Gagal membuat Club");
  }
  return response.json();
}

export async function getClubById(id: string): Promise<Club> {
  // Ambil satu club berdasarkan ID
  const response = await fetch(`${API_URL}/club/${id}`);

  if (!response.ok) {
    throw new Error("Club tidak ditemukan");
  }

  return response.json();
}

// Fungsi untuk mengedit data club
export async function updateClub(
  id: string,
  formData: FormData,
): Promise<Club> {
  const response = await fetch(`${API_URL}/club/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(result?.message || "Gagal memperbarui data club");
  }

  return response.json();
}
