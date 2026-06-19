interface StatBarProps {
  name: string;
  value: number;
  max?: number;
}

const STAT_LABELS: Record<string, string> = {
  hp:               'HP',
  attack:           'ATK',
  defense:          'DEF',
  'special-attack': 'S.ATK',
  'special-defense':'S.DEF',
  speed:            'SPD',
};

const STAT_COLORS: Record<string, string> = {
  hp:               '#4ade80',
  attack:           '#f87171',
  defense:          '#60a5fa',
  'special-attack': '#c084fc',
  'special-defense':'#818cf8',
  speed:            '#facc15',
};

export default function StatBar({ name, value, max = 255 }: StatBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const label = STAT_LABELS[name] ?? name;
  const color = STAT_COLORS[name] ?? '#8a8074';

  return (
    <div className="flex items-center gap-2">
      <span className="w-12 text-right text-xs font-semibold tracking-widest uppercase shrink-0 text-stone-500 font-mono">
        {label}
      </span>
      <span className="w-8 text-right text-xs shrink-0 text-stone-100 font-mono">
        {value}
      </span>
      <div className="flex-1 h-1 bg-stone-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
