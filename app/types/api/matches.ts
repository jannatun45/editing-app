export type MatchPlayer = {
  _id: string;
  name: string;
  nickname?: string;
};
export type MatchClub = {
  _id: string;
  name_club: string;
  stadium?: string;
  logo: string | null;
};

export type MatchGoal = {
  _id?: string;
  minute: number;
  injury_time: number;
  club: MatchClub;
  scorer: MatchPlayer;
  player: MatchPlayer;
  assist: MatchPlayer | null;
  is_penalty: boolean;
  is_own_goal?: boolean;
};

export type MatchGoalInput = {
  player: any;
  club: string;
  scorer: string;
  minute: number;
  assist: string;
  is_own_goal: boolean;
  is_penalty: boolean;
  injury_time: 0;
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
  stadium?: string;
  poster?: string | null;
};

export type UpdateMatchScorePayload = {
  matchday: number;
  match_date: string;
  home_score: number;
  away_score: number;
  goals: MatchGoalInput[];
};
