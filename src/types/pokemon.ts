export interface PokemonStat {
  name: string;
  value: number;
}

export interface Pokemon {
  name: string;
  height: number;        // in decimetres
  weight: number;        // in hectograms
  types: string[];
  stats: PokemonStat[];
  sprite: string;
  id: number;
}

export interface TypeCount {
  type: string;
  count: number;
}

export interface TeamSummary {
  totalWeight: number;
  averageHeight: number;
  totalHp: number;
  typeCounts: TypeCount[];
}

export interface TeamResponse {
  team: Pokemon[];
  summary: TeamSummary;
}
