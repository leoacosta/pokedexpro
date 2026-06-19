import { useState, useEffect } from 'react';

const POKEAPI_LIST = 'https://pokeapi.co/api/v2/pokemon?limit=151&offset=0';

export interface PokemonListEntry {
  name: string;
  url: string;
}

export interface PokemonPreview {
  name: string;
  id: number;
  sprite: string;
  types: string[];
}

export function getIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

export function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function usePokemonList() {
  const [allPokemon, setAllPokemon] = useState<PokemonListEntry[]>([]);
  const [previews, setPreviews] = useState<Record<string, PokemonPreview>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(POKEAPI_LIST)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load Pokédex (${r.status})`);
        return r.json();
      })
      .then(async (d) => {
        const list: PokemonListEntry[] = d.results;
        setAllPokemon(list);

        const results = await Promise.allSettled(
          list.map(async (entry) => {
            const id = getIdFromUrl(entry.url);
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!res.ok) throw new Error(`${res.status}`);
            const data = await res.json();
            return {
              name: entry.name,
              id,
              sprite:
                data.sprites.other?.['official-artwork']?.front_default ??
                data.sprites.front_default ??
                spriteUrl(id),
              types: data.types.map(
                (t: { type: { name: string } }) => t.type.name,
              ),
            } satisfies PokemonPreview;
          }),
        );

        setPreviews(
          Object.fromEntries(
            results
              .filter(
                (r): r is PromiseFulfilledResult<PokemonPreview> =>
                  r.status === 'fulfilled',
              )
              .map((r) => [r.value.name, r.value]),
          ),
        );
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  return { allPokemon, previews, error };
}
