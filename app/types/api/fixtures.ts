export type FixturePlayer = {
  _id: string;
  name: string;
};

export type FixtureClub = {
  _id: string;
  name_club: string;
  logo: string | null;
};

export type FixtureGoal = {
  _id: string;

  club: FixtureClub;

  scorer: FixturePlayer;

  minute: number;

  assist: FixturePlayer | null;

  is_penalty: boolean;
};

export type Fixture = {
  _id: string;

  season: string;

  matchday: number;

  home_club: FixtureClub;

  away_club: FixtureClub;

  match_date: string | null;

  home_score: number | null;

  away_score: number | null;

  status: "scheduled" | "finished" | "postponed";

  goals: FixtureGoal[];

  createdAt: string;

  updatedAt: string;
};
