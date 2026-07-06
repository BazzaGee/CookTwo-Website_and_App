import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UnitSystem } from '../lib/units';

interface PreferencesState {
  units: UnitSystem;
  setUnits: (units: UnitSystem) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      units: 'metric',
      setUnits: (units) => set({ units }),
    }),
    {
      name: 'cfs.preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ units: state.units }),
    },
  ),
);
