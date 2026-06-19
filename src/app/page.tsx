'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { typeColor } from '@/lib/typeColors';
import TypeBadge from '@/components/TypeBadge';
import {
  usePokemonList,
  getIdFromUrl,
  spriteUrl,
} from '@/hooks/usePokemonList';
import PokeballIcon from '@/components/PokeballIcon';

const MAX_TEAM_SIZE = 6;

export default function SelectorPage() {
  const router = useRouter();
  const { allPokemon, previews, error: listError } = usePokemonList();
  const [team, setTeam] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [generating, setGenerating] = useState(false);

  const addToTeam = (name: string) => {
    if (team.length >= MAX_TEAM_SIZE) return;
    setTeam((prev) => [...prev, name]);
  };

  const removeFromTeam = (index: number) => {
    setTeam((prev) => prev.filter((_, i) => i !== index));
  };

  const generateTeam = () => {
    if (generating || team.length === 0) return;
    setGenerating(true);
    setTimeout(() => {
      router.push(`/team?names=${team.join(',')}`);
    }, 1500);
    setTimeout(() => setGenerating(false), 3000);
  };

  const teamFull = team.length >= MAX_TEAM_SIZE;

  const visiblePokemon = query.trim()
    ? allPokemon.filter((p) => p.name.includes(query.toLowerCase().trim()))
    : allPokemon;

  return (
    <main className="min-h-screen bg-stone-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-stone-800 bg-stone-950/95 backdrop-blur-sm">
        <div className="max-w-[2560px] mx-auto px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <PokeballIcon size={22} />
            <h1 className="text-base font-bold tracking-wide text-stone-100 leading-none font-display whitespace-nowrap">
              POKÉDEX PRO
            </h1>
          </div>
          <div className="flex-1 flex sm:justify-end">
            <input
              type="search"
              placeholder="Search by Pokémon name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-56 h-7 bg-stone-900 border border-stone-800 rounded-full px-3 text-xs text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-stone-600 font-mono"
            />
          </div>
        </div>
      </header>

      {/* Floating team panel */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pb-3">
        <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-stone-950/80 backdrop-blur-xl overflow-x-auto max-w-full">
          {Array.from({ length: MAX_TEAM_SIZE }).map((_, slotIndex) => {
            const name = team[slotIndex];
            const preview = name ? previews[name] : undefined;
            const color = preview?.types[0]
              ? typeColor(preview.types[0])
              : undefined;

            if (name) {
              return (
                <div
                  key={`${name}-${slotIndex}`}
                  className="h-7 flex items-center gap-1.5 pl-1 pr-2 rounded-full border bg-stone-900 shrink-0"
                  style={{ borderColor: `${color}55` }}
                >
                  <img
                    src={preview?.sprite ?? spriteUrl(preview?.id ?? 0)}
                    alt={name}
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                  <span className="capitalize text-xs font-semibold text-stone-100 font-display">
                    {name}
                  </span>
                  <button
                    onClick={() => removeFromTeam(slotIndex)}
                    className="text-stone-600 hover:text-red-500 transition-colors leading-none ml-0.5"
                    aria-label={`Remove ${name}`}
                  >
                    ×
                  </button>
                </div>
              );
            }

            return (
              <div
                key={`empty-${slotIndex}`}
                className="h-7 flex items-center px-3 rounded-full border border-dashed border-stone-600 shrink-0"
              >
                <span className="text-xs text-stone-500 font-mono">
                  {slotIndex + 1}
                </span>
              </div>
            );
          })}

          <button
            onClick={generateTeam}
            disabled={team.length === 0 || generating}
            className="h-7 shrink-0 flex items-center gap-1.5 px-3 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors font-display whitespace-nowrap"
          >
            {generating ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                CREATING…
              </>
            ) : (
              'CREATE TEAM'
            )}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 flex flex-col max-w-[2560px] mx-auto w-full px-6 py-6 pb-20">
        {listError ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <p className="text-red-500 text-xs font-mono">{listError}</p>
          </div>
        ) : allPokemon.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
            <p className="text-xs uppercase tracking-widest text-stone-500 font-mono">
              Loading Pokédex…
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
            {visiblePokemon.map((entry) => {
              const preview = previews[entry.name];
              const id = getIdFromUrl(entry.url);
              const primaryType = preview?.types[0];
              const color = primaryType ? typeColor(primaryType) : '#44403c';

              return (
                <button
                  key={entry.name}
                  onClick={() => addToTeam(entry.name)}
                  disabled={teamFull}
                  className="group flex flex-col items-center gap-1.5 p-3 rounded-xl border border-stone-800 bg-stone-900 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  onMouseEnter={(e) => {
                    if (!teamFull) {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        color;
                      (e.currentTarget as HTMLElement).style.transform =
                        'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '';
                    (e.currentTarget as HTMLElement).style.transform = '';
                  }}
                >
                  <img
                    src={preview?.sprite ?? spriteUrl(id)}
                    alt={entry.name}
                    width={72}
                    height={72}
                    className="object-contain transition-transform duration-150 group-hover:scale-105"
                  />
                  <span className="capitalize text-sm font-semibold text-stone-100 text-center leading-tight font-display">
                    {entry.name}
                  </span>
                  <div className="flex gap-1 justify-center flex-wrap min-h-[20px] mt-2">
                    {preview?.types.map((t) => (
                      <TypeBadge key={t} type={t} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
