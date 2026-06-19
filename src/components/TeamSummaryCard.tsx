import { TeamSummary } from "@/types/pokemon";
import TypeBadge from "./TypeBadge";

const STATS = [
  { key: 'totalWeight' as const,   label: 'Total Weight', format: (v: number) => `${(v / 10).toFixed(1)} kg` },
  { key: 'averageHeight' as const, label: 'Avg. Height',  format: (v: number) => `${(v / 10).toFixed(2)} m`  },
  { key: 'totalHp' as const,       label: 'Total HP',     format: (v: number) => String(v)                   },
];

export default function TeamSummaryCard({ summary }: { summary: TeamSummary }) {
  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
      <h2 className="text-xs uppercase tracking-widest mb-5 text-stone-500 font-mono">
        Team Summary
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATS.map(({ key, label, format }) => (
          <div key={key} className="text-center">
            <p className="text-3xl font-bold text-stone-100 leading-none font-display">
              {format(summary[key])}
            </p>
            <p className="text-xs uppercase tracking-widest mt-2 text-stone-500 font-mono">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-800 pt-4">
        <p className="text-xs uppercase tracking-widest mb-3 text-stone-500 font-mono">
          Type Breakdown
        </p>
        <div className="flex flex-wrap gap-2">
          {summary.typeCounts.map(({ type, count }) => (
            <div key={type} className="flex items-center gap-1.5">
              <TypeBadge type={type} />
              <span className="text-xs text-stone-500 font-mono">×{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
