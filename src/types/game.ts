export const CANONICAL_ORIGIN = 'https://georushcue.bastelar.com';

export type LanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'pt'
  | 'ar'
  | 'hi'
  | 'ru'
  | 'zh'
  | 'ja';

export const SUPPORTED_LANGUAGES: readonly LanguageCode[] = [
  'en',
  'es',
  'fr',
  'de',
  'pt',
  'ar',
  'hi',
  'ru',
  'zh',
  'ja',
] as const;

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ar: 'العربية',
  hi: 'हिन्दी',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
};

export type CategoryId = 'all' | 'countries' | 'capitals' | 'rivers' | 'monuments';
export type ItemCategory = Exclude<CategoryId, 'all'>;
export type RoundDuration = 60 | 90 | 120;
export type RegionId = 'europe' | 'americas' | 'asia' | 'africa' | 'oceania' | 'middle_east';

export interface LocalizedGeoEntry {
  name: string;
  clues: [string, string, string];
}

export interface GeoItem {
  id: string;
  category: ItemCategory;
  region: RegionId;
  lat: number;
  lon: number;
  riverPath?: Array<[number, number]>;
  translations: Record<LanguageCode, LocalizedGeoEntry>;
}

export interface ChallengePayload {
  v: 1;
  seed: string;
  category: CategoryId;
  duration: RoundDuration;
  score: number;
  correct: number;
  answered: number;
  bestStreak: number;
  cluesSaved: number;
  challengerName: string;
  createdAt: number;
}

export interface RoundQuestionResult {
  itemId: string;
  category: ItemCategory;
  region: RegionId;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  skipped: boolean;
  cluesUsed: 1 | 2 | 3;
  elapsedSec: number;
  pointsEarned: number;
}

export interface SavedRoundRecord {
  id: string;
  seed: string;
  category: CategoryId;
  duration: RoundDuration;
  score: number;
  correct: number;
  answered: number;
  bestStreak: number;
  cluesSaved: number;
  playedAt: string;
  opponentScore?: number;
  opponentName?: string;
  duelOutcome?: 'win' | 'tie' | 'loss';
}

export interface LocalSaveState {
  version: 1;
  playerName: string;
  soundEnabled: boolean;
  notes: string;
  bestByCategory: Record<CategoryId, number>;
  history: SavedRoundRecord[];
}
