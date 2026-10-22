export type MatchPlayer = {
  _id: string;
  name: string;
};
export type MatchClub = {
  _id: string;
  name_club: string;
  logo: string | null;
};

export type MatchGoal = {
  _id?: string;
  minute: number;
  club: MatchClub;
  scorer: MatchPlayer;
  player: MatchPlayer;
  assist: MatchPlayer | null;
  is_penalty: boolean;
  is_own_goal?: boolean;
};

export type MatchGoalInput = {
  club: string;
  scorer: string;
  minute: string;
  assist: string;
  is_own_goal: boolean;
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
  goals: MatchGoal[];
  createdAt: string;
  updatedAt: string;
};
