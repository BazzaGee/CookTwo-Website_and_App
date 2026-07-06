import { useEffect, useState } from 'react';
import { usePreferencesStore } from '../stores/preferencesStore';
import { kgToLb, lbToKg, cmToFtIn, ftInToCm, round1, round2, round4 } from '../lib/units';
import UnitToggle from './UnitToggle';

interface Props {
  weightKg: string;
  heightCm: string;
  onWeightKgChange: (v: string) => void;
  onHeightCmChange: (v: string) => void;
  inputClassName?: string;
}

const DEFAULT_INPUT_CLASS =
  'w-full bg-white border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors';

function seedWeight(units: 'metric' | 'imperial', weightKg: string): string {
  if (units === 'metric') return weightKg;
  const kg = parseFloat(weightKg);
  return Number.isFinite(kg) && kg > 0 ? String(round1(kgToLb(kg))) : '';
}

function seedHeightMetric(heightCm: string): string {
  return heightCm;
}

function seedHeightImperial(heightCm: string): { ft: string; inch: string } {
  const cm = parseFloat(heightCm);
  if (!Number.isFinite(cm) || cm <= 0) return { ft: '', inch: '' };
  const r = cmToFtIn(cm);
  return { ft: String(r.ft), inch: String(r.inch) };
}

export default function BodyMetricsFields({
  weightKg,
  heightCm,
  onWeightKgChange,
  onHeightCmChange,
  inputClassName,
}: Props) {
  const units = usePreferencesStore((s) => s.units);
  const setUnits = usePreferencesStore((s) => s.setUnits);

  const [weightDisplay, setWeightDisplay] = useState(() => seedWeight(units, weightKg));
  const [heightCmDisplay, setHeightCmDisplay] = useState(() => seedHeightMetric(heightCm));
  const [heightFt, setHeightFt] = useState(() => seedHeightImperial(heightCm).ft);
  const [heightIn, setHeightIn] = useState(() => seedHeightImperial(heightCm).inch);

  // Reseed display values when the unit system toggles.
  useEffect(() => {
    if (units === 'metric') {
      setWeightDisplay(weightKg);
      setHeightCmDisplay(heightCm);
    } else {
      setWeightDisplay(seedWeight('imperial', weightKg));
      const imp = seedHeightImperial(heightCm);
      setHeightFt(imp.ft);
      setHeightIn(imp.inch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  const handleWeightChange = (v: string) => {
    setWeightDisplay(v);
    if (units === 'metric') {
      onWeightKgChange(v);
      return;
    }
    const lb = parseFloat(v);
    onWeightKgChange(Number.isFinite(lb) && lb > 0 ? String(round4(lbToKg(lb))) : '');
  };

  const handleHeightCmChange = (v: string) => {
    setHeightCmDisplay(v);
    onHeightCmChange(v);
  };

  const recomputeCm = (ft: string, inch: string) => {
    const ftN = parseFloat(ft);
    const inchN = parseFloat(inch);
    if (!Number.isFinite(ftN) && !Number.isFinite(inchN)) {
      onHeightCmChange('');
      return;
    }
    onHeightCmChange(String(round2(ftInToCm(ftN || 0, inchN || 0))));
  };

  const handleHeightFtChange = (v: string) => {
    setHeightFt(v);
    recomputeCm(v, heightIn);
  };

  const handleHeightInChange = (v: string) => {
    setHeightIn(v);
    recomputeCm(heightFt, v);
  };

  const inputCls = inputClassName ?? DEFAULT_INPUT_CLASS;
  const labelCls = 'text-text-secondary text-xs font-medium tracking-wide block mb-2';

  return (
    <div className="space-y-4">
      <UnitToggle units={units} setUnits={setUnits} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>{units === 'metric' ? 'Weight (kg)' : 'Weight (lb)'}</label>
          <input
            type="number"
            inputMode="decimal"
            value={weightDisplay}
            onChange={(e) => handleWeightChange(e.target.value)}
            placeholder={units === 'metric' ? '70' : '154'}
            className={inputCls}
          />
        </div>

        {units === 'metric' ? (
          <div>
            <label className={labelCls}>Height (cm)</label>
            <input
              type="number"
              inputMode="decimal"
              value={heightCmDisplay}
              onChange={(e) => handleHeightCmChange(e.target.value)}
              placeholder="170"
              className={inputCls}
            />
          </div>
        ) : (
          <div>
            <label className={labelCls}>Height (ft · in)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={heightFt}
                onChange={(e) => handleHeightFtChange(e.target.value)}
                placeholder="5"
                className={inputCls}
              />
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={11}
                value={heightIn}
                onChange={(e) => handleHeightInChange(e.target.value)}
                placeholder="10"
                className={inputCls}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
