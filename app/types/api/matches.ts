export type MatchClub = {
  _id: string;
  name_club: string;
  logo: string | null;
  stadium: string | null;
};

export type Match = {
  _id: string;
  season: string;
  matchday: number;

  home_club: MatchClub;
  away_club: MatchClub;

  match_date: string | null;

  home_score: number | null;
  away_score: number | null;

  status: "scheduled" | "finished" | "postponed";

  createdAt: string;
  updatedAt: string;
};
