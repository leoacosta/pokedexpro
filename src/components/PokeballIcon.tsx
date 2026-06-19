export default function PokeballIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <path d="M 2 50 A 48 48 0 0 1 98 50 Z" fill="#dc2626" />
      <path d="M 2 50 A 48 48 0 0 0 98 50 Z" fill="#f5f5f4" />
      <circle cx="50" cy="50" r="48" fill="none" stroke="#0c0a09" strokeWidth="4" />
      <rect x="2" y="46" width="96" height="8" fill="#0c0a09" />
      <circle cx="50" cy="50" r="13" fill="#0c0a09" />
      <circle cx="50" cy="50" r="8" fill="#f5f5f4" />
    </svg>
  );
}
