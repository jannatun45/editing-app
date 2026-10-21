import type { Club } from "./clubs";

export type Player = {
  _id: string;
  name_player: string;
  number: number;
  club: string | Club;
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
// interface Player {
//   _id: string;
//   name_player: string;
//   number?: number;
//   position: Position;
//   photo?: string;
//   club: string | Club;
//   national?: string;
//   date_of_birth?: string;
//   goals?: number;
//   assists?: number;
//   market_value?: number | string;
// }
