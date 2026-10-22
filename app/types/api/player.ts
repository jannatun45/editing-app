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
  date_of_birth: string;
  goals: number;
  assists: number;
  createdAt: string;
  updatedAt: string;
};

// interface Player {
//   _id: string;
//   club: string | Club;
//   name_player: string;
//   number?: number;
//   position: Position;
//   photo?: string;
//   national?: string;
//   date_of_birth?: string;
//   goals?: number;
//   assists?: number;
//   market_value?: number | string;
// }
