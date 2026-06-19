import Image from "next/image";
import { Pokemon } from "@/types/pokemon";
import { typeColor } from "@/lib/typeColors";
import TypeBadge from "./TypeBadge";
import StatBar from "./StatBar";

const PRIORITY_STATS = [
  "hp", "attack", "defense",
  "special-attack", "special-defense", "speed",
];

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const orderedStats = PRIORITY_STATS
    .map((name) => pokemon.stats.find((s) => s.name === name))
    .filter(Boolean) as typeof pokemon.stats;

  const accent = typeColor(pokemon.types[0]);

  return (
    <div className="rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 flex flex-col">
      <div className="h-0.5" style={{ backgroundColor: accent }} />

      <div
        className="relative flex items-center justify-center py-7 px-4"
        style={{ background: `radial-gradient(ellipse at 50% 70%, ${accent}1a 0%, transparent 65%)` }}
      >
        <span className="absolute top-3 right-4 text-xs text-stone-700 font-mono">
          #{String(pokemon.id).padStart(4, '0')}
        </span>
        {pokemon.sprite ? (
          <Image
            src={pokemon.sprite}
            alt={pokemon.name}
            width={156}
            height={156}
            className="object-contain drop-shadow-xl"
            priority
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-stone-800 flex items-center justify-center text-stone-500 text-sm">
            ?
          </div>
        )}
      </div>

      <div className="px-4 pb-5 flex flex-col gap-3 flex-1">
        <div>
          <h2 className="text-xl font-bold capitalize leading-none text-stone-100 font-display">
            {pokemon.name}
          </h2>
          <div className="flex gap-1 mt-2 flex-wrap">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
        </div>

        <div className="flex gap-5 text-sm border-t border-stone-800 pt-3">
          <div>
            <p className="text-xs uppercase tracking-widest mb-1 text-stone-500">Height</p>
            <p className="font-medium font-mono text-stone-100">
              {(pokemon.height / 10).toFixed(1)} m
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest mb-1 text-stone-500">Weight</p>
            <p className="font-medium font-mono text-stone-100">
              {(pokemon.weight / 10).toFixed(1)} kg
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-stone-800 pt-3">
          {orderedStats.map((stat) => (
            <StatBar key={stat.name} name={stat.name} value={stat.value} />
          ))}
        </div>
      </div>
    </div>
  );
}
