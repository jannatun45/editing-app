import type { Stadium } from "~/types/api/stadium";
const API_URL = import.meta.env.VITE_API_URL;

export const getAllStadiums = async (): Promise<Stadium[]> => {
  const response = await fetch(`${API_URL}/stadiums`);

  if (!response.ok) {
    throw new Error("Gagal mengambil daftar stadion");
  }

  const result = await response.json();

  // Mendukung response { data: [...] } maupun langsung [...]
  return Array.isArray(result) ? result : result.data;
};
