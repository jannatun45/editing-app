export type StandingClub = {
  _id: string;
  name_club: string;
  logo: string | null;
};

export type Standing = {
  _id: string;
  season: string;

  club: StandingClub;

  match: number;
  win: number;
  draw: number;
  lose: number;

  points: number;

  goals_for: number;
  goals_againts: number;
  goal_difference: number;
};
