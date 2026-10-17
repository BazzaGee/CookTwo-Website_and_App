import { CATEGORY_EMOJIS, CATEGORY_ORDER, type Category } from './pantry-parse';

export { CATEGORY_EMOJIS, CATEGORY_ORDER };

export function qtyLabel(item: { qtyValue: number | null; qtyUnit: string }): string {
  if (item.qtyValue == null) return '';
  const v = Number.isInteger(item.qtyValue) ? item.qtyValue : Math.round(item.qtyValue * 100) / 100;
  return item.qtyUnit ? `${v} ${item.qtyUnit}` : String(v);
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

export function groupByCategory<T extends { category: Category }>(items: T[]): [Category, T[]][] {
  const map = new Map<Category, T[]>();
  for (const item of items) {
    const arr = map.get(item.category) ?? [];
    arr.push(item);
    map.set(item.category, arr);
  }
  return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => [c, map.get(c)!] as [Category, T[]]);
}

export function confidenceClass(c: number): string {
  if (c >= 0.8) return 'bg-sage/10 text-sage-dark';
  if (c >= 0.65) return 'bg-terracotta/15 text-terracotta-dark';
  return 'bg-terracotta/20 text-terracotta-dark';
}
