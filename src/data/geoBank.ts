import { COUNTRIES_BANK } from './countries';
import { CAPITALS_BANK } from './capitals';
import { RIVERS_BANK } from './rivers';
import { MONUMENTS_BANK } from './monuments';
import type { CategoryId, GeoItem } from '../types/game';
import { createSeededRng, shuffleDeterministic } from '../utils/challengeLink';

export const ALL_GEO_ITEMS: GeoItem[] = [
  ...COUNTRIES_BANK,
  ...CAPITALS_BANK,
  ...RIVERS_BANK,
  ...MONUMENTS_BANK,
];

export const GEO_BY_ID: Record<string, GeoItem> = Object.fromEntries(
  ALL_GEO_ITEMS.map((item) => [item.id, item])
);

export function getPoolByCategory(category: CategoryId): GeoItem[] {
  if (category === 'all') {
    return ALL_GEO_ITEMS;
  }
  return ALL_GEO_ITEMS.filter((item) => item.category === category);
}

export interface DeterministicQuestion {
  item: GeoItem;
  options: GeoItem[];
}

export function buildDeterministicDeck(
  seed: string,
  category: CategoryId
): DeterministicQuestion[] {
  const rng = createSeededRng(`${seed}:${category}`);
  const pool = getPoolByCategory(category);
  const shuffledOrder = shuffleDeterministic(pool, rng);

  // Repeat with deterministic secondary permutations if a very fast player clears the whole deck
  const extendedOrder: GeoItem[] = [
    ...shuffledOrder,
    ...shuffleDeterministic(pool, rng),
    ...shuffleDeterministic(pool, rng),
  ];

  return extendedOrder.map((item, idx) => {
    const sameCategory = ALL_GEO_ITEMS.filter(
      (candidate) => candidate.category === item.category && candidate.id !== item.id
    );
    const distractorsRng = createSeededRng(`${seed}:${category}:q:${idx}:${item.id}`);
    const distractors = shuffleDeterministic(sameCategory, distractorsRng).slice(0, 3);
    const options = shuffleDeterministic([item, ...distractors], distractorsRng);
    return { item, options };
  });
}
