const GUIDE_SLUG_OVERRIDES: Record<string, string> = {
  mcdougall: 'high-carb',
  'hclf-811': '80-10-10',
};

const SITE = 'https://cooktwo.com';

export function dietGuideUrl(dietKey: string): string {
  if (dietKey === 'omnivore') return `${SITE}/diets/`;
  const slug = GUIDE_SLUG_OVERRIDES[dietKey] ?? dietKey;
  return `${SITE}/diets/${slug}/`;
}
