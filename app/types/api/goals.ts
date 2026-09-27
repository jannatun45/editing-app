export type MatchGoal = {
  _id?: string;
  club: string;
  scorer: string;
  minute: number;
  assist: string | null;
};

export type Match = {
  _id: string;
  season: string;
  matchday: number;

  home_club: {
    _id: string;
    name_club: string;
    logo: string | null;
  };

  away_club: {
    _id: string;
    name_club: string;
    logo: string | null;
  };

  home_score: number | null;
  away_score: number | null;

  match_date: string | null;

  status: "scheduled" | "finished" | "postponed";

  goals: MatchGoal[];
};
