import { typeColor } from '@/lib/typeColors';

export default function TypeBadge({ type }: { type: string }) {
  const color = typeColor(type);
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider font-mono"
      style={{
        color,
        backgroundColor: `${color}22`,
        border: `1px solid ${color}44`,
      }}
    >
      {type}
    </span>
  );
}
