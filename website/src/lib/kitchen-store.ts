// Shared state for the kitchen tool. One instance per page: all tool
// components import this module, so Astro/Vite bundles it once and every
// component reads and writes the same store. Persistence is localStorage,
// namespaced per audience (couples page vs solo page keep their own lists).

import { parsePantryItemSync, type Category, type ParsedPantryItem } from './pantry-parse';

export type Audience = 'couples' | 'solo';
export type Partner = 'a' | 'b';
export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'gain';
export type UnitSystem = 'metric' | 'imperial';

export interface ListItem {
  id: string;
  raw: string;
  name: string;
  qtyValue: number | null;
  qtyUnit: string;
  brand: string;
  category: Category;
  isFood: boolean;
  confidence: number;
  needsReview: boolean;
  done: boolean;
  addedBy: Partner;
}

export interface ProfileForm {
  name: string;
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  dietKey: string;
}

export interface ToolState {
  shopping: ListItem[];
  pantry: ListItem[];
  profiles: { a: ProfileForm; b: ProfileForm };
  units: UnitSystem;
}

const NS = 'cooktwo.kitchen-tool.v1';

function getAudience(): Audience {
  const root = document.querySelector('[data-kitchen-tool]');
  const a = root?.getAttribute('data-audience');
  return a === 'solo' ? 'solo' : 'couples';
}

const uid = (): string => Math.random().toString(36).slice(2, 10);

function defaultProfiles(): { a: ProfileForm; b: ProfileForm } {
  return {
    a: { name: 'You', weightKg: 68, heightCm: 168, age: 34, gender: 'female', activityLevel: 'moderate', goal: 'maintain', dietKey: '' },
    b: { name: 'Your partner', weightKg: 84, heightCm: 180, age: 37, gender: 'male', activityLevel: 'moderate', goal: 'maintain', dietKey: '' },
  };
}

function defaultState(): ToolState {
  return { shopping: [], pantry: [], profiles: defaultProfiles(), units: 'metric' };
}

function load(): ToolState {
  const fallback = defaultState();
  try {
    const raw = localStorage.getItem(`${NS}.${getAudience()}`);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<ToolState>;
    return {
      shopping: Array.isArray(parsed.shopping) ? parsed.shopping : [],
      pantry: Array.isArray(parsed.pantry) ? parsed.pantry : [],
      profiles: {
        a: { ...fallback.profiles.a, ...(parsed.profiles?.a ?? {}) },
        b: { ...fallback.profiles.b, ...(parsed.profiles?.b ?? {}) },
      },
      units: parsed.units === 'imperial' ? 'imperial' : 'metric',
    };
  } catch {
    return fallback;
  }
}

let state: ToolState = load();
const listeners = new Set<(s: ToolState) => void>();

function save() {
  try {
    localStorage.setItem(`${NS}.${getAudience()}`, JSON.stringify(state));
  } catch {
    /* storage full or blocked — the tool still works for this session */
  }
}

export function getState(): ToolState {
  return state;
}

export function onChange(fn: (s: ToolState) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function commit(next: Partial<ToolState> | ((s: ToolState) => Partial<ToolState>)) {
  const patch = typeof next === 'function' ? next(state) : next;
  state = { ...state, ...patch };
  save();
  listeners.forEach((fn) => fn(state));
}

// ------------------------------------------------------------------ items

function toListItem(raw: string, parsed: ParsedPantryItem, addedBy: Partner): ListItem {
  return {
    id: uid(),
    raw,
    name: parsed.name || raw,
    qtyValue: parsed.quantityValue,
    qtyUnit: parsed.quantityUnit,
    brand: parsed.brand,
    category: parsed.category,
    isFood: parsed.isFood,
    confidence: parsed.confidence,
    needsReview: parsed.needsReview,
    done: false,
    addedBy,
  };
}

export function addToShopping(rawLines: string, addedBy: Partner): ListItem[] {
  const added: ListItem[] = [];
  for (const line of rawLines.split(/[,;\n]+/)) {
    const raw = line.trim();
    if (!raw) continue;
    added.push(toListItem(raw, parsePantryItemSync(raw), addedBy));
  }
  if (added.length) commit((s) => ({ shopping: [...s.shopping, ...added] }));
  return added;
}

export function addToPantry(rawLines: string, addedBy: Partner = 'a'): ListItem[] {
  const added: ListItem[] = [];
  for (const line of rawLines.split(/[,;\n]+/)) {
    const raw = line.trim();
    if (!raw) continue;
    added.push(toListItem(raw, parsePantryItemSync(raw), addedBy));
  }
  if (added.length) commit((s) => ({ pantry: [...s.pantry, ...added] }));
  return added;
}

export function setShoppingDone(id: string, done: boolean) {
  commit((s) => ({ shopping: s.shopping.map((it) => (it.id === id ? { ...it, done } : it)) }));
}

export function removeShopping(id: string) {
  commit((s) => ({ shopping: s.shopping.filter((it) => it.id !== id) }));
}

export function clearCheckedShopping() {
  commit((s) => ({ shopping: s.shopping.filter((it) => !it.done) }));
}

export function moveCheckedToPantry(): number {
  const n = state.shopping.filter((it) => it.done).length;
  if (!n) return 0;
  commit((s) => ({
    pantry: [...s.pantry, ...s.shopping.filter((it) => it.done).map((it) => ({ ...it, id: uid() }))],
    shopping: s.shopping.filter((it) => !it.done),
  }));
  return n;
}

export function removePantry(id: string) {
  commit((s) => ({ pantry: s.pantry.filter((it) => it.id !== id) }));
}

export function setPantryCategory(id: string, category: Category) {
  commit((s) => ({
    pantry: s.pantry.map((it) => (it.id === id ? { ...it, category } : it)),
  }));
}

// ----------------------------------------------------------------- profiles

export function setProfile(who: Partner, patch: Partial<ProfileForm>) {
  commit((s) => ({ profiles: { ...s.profiles, [who]: { ...s.profiles[who], ...patch } } }));
}

export function setUnits(units: UnitSystem) {
  commit({ units });
}
