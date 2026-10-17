// Shared localStorage helpers for the Kitchen Tool pages.
// Each audience (couples / solo) gets its own namespace so the two pages
// never share state. Nothing is sent to a server — purely browser storage.

import type { Category } from './pantry-parse';
import type { ParsedPantryItem } from './pantry-parse';

export interface ToolItem {
  id: string;
  name: string;
  qty: string;
  brand: string;
  category: Category;
  isFood: boolean;
  needsReview: boolean;
  checked: boolean;
  addedBy: 1 | 2;
}

export function storageKey(ns: string, list: 'shopping' | 'pantry'): string {
  return `cooktwo-kitchen-tool:${ns}:${list}`;
}

export interface DietSelection {
  a: string;
  b?: string;
}

export function dietStorageKey(ns: string): string {
  return `cooktwo-kitchen-tool:${ns}:diet`;
}

export function loadDiet(ns: string): DietSelection | null {
  try {
    const raw = localStorage.getItem(dietStorageKey(ns));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const a = typeof parsed.a === 'string' ? parsed.a : '';
    if (!a) return null;
    const b = typeof parsed.b === 'string' ? parsed.b : undefined;
    return { a, b };
  } catch {
    return null;
  }
}

export function saveDiet(ns: string, sel: DietSelection): void {
  try {
    localStorage.setItem(dietStorageKey(ns), JSON.stringify(sel));
  } catch {
    // storage full / private mode — the tool still works for this session
  }
}

export function loadList(ns: string, list: 'shopping' | 'pantry'): ToolItem[] {
  try {
    const raw = localStorage.getItem(storageKey(ns, list));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((it): it is ToolItem => it && typeof it.name === 'string');
  } catch {
    return [];
  }
}

export function saveList(ns: string, list: 'shopping' | 'pantry', items: ToolItem[]): void {
  try {
    localStorage.setItem(storageKey(ns, list), JSON.stringify(items));
  } catch {
    // storage full / private mode — the tool still works for this session
  }
}

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function formatQty(parsed: Pick<ParsedPantryItem, 'quantityValue' | 'quantityUnit'>): string {
  if (parsed.quantityValue == null) return '';
  const value = Number.isInteger(parsed.quantityValue)
    ? String(parsed.quantityValue)
    : String(Math.round(parsed.quantityValue * 100) / 100);
  return parsed.quantityUnit ? `${value} ${parsed.quantityUnit}` : value;
}

export function itemFromParsed(parsed: ParsedPantryItem, addedBy: 1 | 2): ToolItem {
  return {
    id: makeId(),
    name: parsed.name,
    qty: formatQty(parsed),
    brand: parsed.brand,
    category: (parsed.category as Category) === 'Other' ? 'Pantry' : (parsed.category as Category),
    isFood: parsed.isFood,
    needsReview: parsed.needsReview,
    checked: false,
    addedBy,
  };
}

export function itemDisplayName(item: ToolItem): string {
  const bits: string[] = [];
  if (item.qty) bits.push(item.qty);
  if (item.brand) bits.push(item.brand);
  return bits.length > 0 ? `${item.name} (${bits.join(', ')})` : item.name;
}
