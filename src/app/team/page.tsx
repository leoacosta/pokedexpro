'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PokemonCard from '@/components/PokemonCard';
import TeamSummaryCard from '@/components/TeamSummaryCard';
import PokeballIcon from '@/components/PokeballIcon';
import { TeamResponse } from '@/types/pokemon';

function TeamView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const names = searchParams.get('names') ?? '';

  const [data, setData] = useState<TeamResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!names) {
      setError('No Pokémon names provided.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/pokemon/team?names=${encodeURIComponent(names)}`)
      .then((r) => {
        if (!r.ok && r.headers.get('content-type')?.includes('application/json') === false) {
          throw new Error(`Server error (${r.status})`);
        }
        return r.json();
      })
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [names]);

  return (
    <main className="min-h-screen bg-stone-950 flex flex-col">
      <header className="sticky top-0 z-20 border-b border-stone-800 bg-stone-950/95 backdrop-blur-sm">
        <div className="max-w-[2560px] mx-auto px-6 py-3 flex items-center gap-4">
          <PokeballIcon size={22} />
          <h1 className="text-base font-bold tracking-wide text-stone-100 leading-none font-display">
            POKÉDEX PRO
          </h1>
          <button
            onClick={() => router.push('/')}
            className="ml-auto h-7 flex items-center px-3 rounded-full border border-stone-800 hover:border-stone-600 bg-stone-900 text-stone-400 hover:text-stone-100 text-xs font-bold transition-colors font-display whitespace-nowrap"
          >
            ← BACK
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-[2560px] mx-auto w-full px-6 py-8">
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
            <p className="text-xs uppercase tracking-widest text-stone-500 font-mono">
              Assembling team…
            </p>
          </div>
        )}

        {error && (
          <div className="border border-red-600/30 bg-red-600/10 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-bold text-lg mb-3 font-display">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-100 transition-colors font-mono"
            >
              ← Go back
            </button>
          </div>
        )}

        {data && (
          <div className="flex flex-col gap-8">
            <TeamSummaryCard summary={data.summary} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.team.map((pokemon, i) => (
                <PokemonCard key={`${pokemon.id}-${i}`} pokemon={pokemon} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TeamPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <TeamView />
    </Suspense>
  );
}
