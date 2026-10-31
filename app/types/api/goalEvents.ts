export type GoalEvent = {
  _id: string;
  fixture:
    | string
    | {
        _id: string;
        matchday?: number;
        homeScore?: number;
        awayScore?: number;
      };
  season: string;
  club: {
    _id: string;
    name_club: string;
    logo?: string;
  };
  player: {
    _id: string;
    name_player: string;
    number?: number;
    photo?: string;
  };
  assist: {
    _id: string;
    name_player: string;
    number?: number;
    photo?: string;
  } | null;
  minute: number;
};
