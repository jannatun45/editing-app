export type Player = {
  _id: string;
  club: string;
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
