export interface Avatar {
  name: string;
  code: string;
}

export interface ArenaRanking {
  ranking: number;
  name: string;
  address: string;
  code: string;
  cp?: number;
  score: number;
  winRate?: number;
}
