import type { UnitSystem } from '../lib/units';

interface Props {
  units: UnitSystem;
  setUnits: (u: UnitSystem) => void;
}

const OPTIONS: { value: UnitSystem; label: string }[] = [
  { value: 'metric', label: 'Metric' },
  { value: 'imperial', label: 'Imperial' },
];

export default function UnitToggle({ units, setUnits }: Props) {
  return (
    <div className="inline-flex p-1 bg-cream-dark rounded-lg gap-1" role="group" aria-label="Measurement units">
      {OPTIONS.map((opt) => {
        const active = units === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setUnits(opt.value)}
            aria-pressed={active}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              active ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
