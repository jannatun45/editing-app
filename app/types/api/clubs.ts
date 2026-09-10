// 1. data club form

export type Club = {
  _id: string;
  id_player: string | null;
  points: number;
  logo: string | null;
  name_club: string;
  stadium: string | null;
  match: number;
  win: number;
  lose: number;
  goals_for: number;
  goals_againts: number;
  goal_difference: number;
  district: string | null;
  createdAt: string;
  updatedAt: string;
};
