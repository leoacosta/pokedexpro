import { Pokemon, TeamSummary, TeamResponse, TypeCount } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchFromApi(url: string): Promise<any> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`PokéAPI error: ${res.status} for ${url}`);
  return res.json();
}

export async function fetchPokemon(name: string): Promise<Pokemon> {
  const data = await fetchFromApi(`${BASE_URL}/pokemon/${name.toLowerCase().trim()}`);

  const stats = data.stats.map((s: { stat: { name: string }; base_stat: number }) => ({
    name: s.stat.name,
    value: s.base_stat,
  }));

  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    types: data.types.map((t: { type: { name: string } }) => t.type.name),
    stats,
    sprite:
      data.sprites.other?.["official-artwork"]?.front_default ??
      data.sprites.front_default ??
      "",
  };
}

export async function fetchPokemonList(limit = 151, offset = 0): Promise<{ name: string; url: string }[]> {
  const data = await fetchFromApi(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  return data.results;
}

export function buildTeamSummary(team: Pokemon[]): TeamSummary {
  const totalWeight = team.reduce((sum, p) => sum + p.weight, 0);
  const averageHeight = team.length ? team.reduce((sum, p) => sum + p.height, 0) / team.length : 0;

  const totalHp = team.reduce((sum, p) => {
    const hp = p.stats.find((s) => s.name === "hp")?.value ?? 0;
    return sum + hp;
  }, 0);

  const typeMap: Record<string, number> = {};
  team.forEach((p) => {
    p.types.forEach((type) => {
      typeMap[type] = (typeMap[type] ?? 0) + 1;
    });
  });

  const typeCounts: TypeCount[] = Object.entries(typeMap)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  return { totalWeight, averageHeight, totalHp, typeCounts };
}

export async function buildTeamResponse(names: string[]): Promise<TeamResponse> {
  const results = await Promise.allSettled(names.map(fetchPokemon));

  const team: Pokemon[] = results
    .filter((r): r is PromiseFulfilledResult<Pokemon> => r.status === "fulfilled")
    .map((r) => r.value);

  const failed = results
    .map((r, i) => (r.status === "rejected" ? names[i] : null))
    .filter(Boolean);

  if (failed.length > 0) {
    throw new Error(`Could not find Pokémon: ${failed.join(", ")}`);
  }

  return { team, summary: buildTeamSummary(team) };
}
