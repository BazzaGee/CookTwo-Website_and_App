import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

const TARGET_MS = Date.UTC(2026, 10, 1, 0, 0, 0);

const pad = (n: number) => String(n).padStart(2, '0');

function remainingParts() {
  const remaining = TARGET_MS - Date.now();
  if (remaining <= 0) return null;
  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000),
  };
}

export default function CountdownBanner() {
  const [parts, setParts] = useState(remainingParts);

  useEffect(() => {
    const id = window.setInterval(() => setParts(remainingParts()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!parts) return null;

  const tiles = [
    { key: 'days', value: String(parts.days), unit: parts.days === 1 ? 'day' : 'days' },
    { key: 'hours', value: pad(parts.hours), unit: 'hrs' },
    { key: 'minutes', value: pad(parts.minutes), unit: 'min' },
    { key: 'seconds', value: pad(parts.seconds), unit: 'sec' },
  ];

  return (
    <div role="timer" aria-live="off" className="bg-white border border-sage/40 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Timer size={14} className="text-terracotta flex-shrink-0" />
            <p className="text-text-primary text-xs font-semibold">Premium goes live 1 November 2026</p>
          </div>
          <p className="text-text-secondary text-[11px] leading-snug">
            Free stays free. Both tiers below are available today.
          </p>
          <p className="sr-only">Countdown to 1 November 2026 at 00:00 UTC.</p>
        </div>

        <div className="flex items-stretch gap-1.5 flex-shrink-0">
          {tiles.map((tile) => (
            <div
              key={tile.key}
              className="w-11 text-center bg-cream border border-border rounded-lg px-1 py-1.5"
            >
              <p data-unit={tile.key} className="text-sm font-bold text-sage tabular-nums leading-none">{tile.value}</p>
              <p className="text-[9px] uppercase tracking-wide text-text-secondary mt-0.5">{tile.unit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
