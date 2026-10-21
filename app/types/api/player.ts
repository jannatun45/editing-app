import type { Club } from "~/types/api/clubs";

export type Player = {
  _id: string;
  // club: string;
  club: string | Club | null;
  name_player: string;
  number: number;
  position: "GK" | "DF" | "MF" | "FW";
  photo: string | null;
  contract_expires: string | null;
  joined: string | null;
  national: string | null;
  market_value: number | null;
  date_of_birth: string | null;
  goals: number;
  assists: number;
  createdAt: string;
  updatedAt: string;
};
