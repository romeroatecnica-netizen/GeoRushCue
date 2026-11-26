import {
  CANONICAL_ORIGIN,
  type CategoryId,
  type ChallengePayload,
  type LanguageCode,
  type RoundDuration,
} from '../types/game';

export function hashSeedString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createSeededRng(seedStr: string): () => number {
  let state = hashSeedString(seedStr) || 123456789;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleDeterministic<T>(items: readonly T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export function generateRoundSeed(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  const randomValues = new Uint32Array(6);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < 6; i += 1) {
      result += chars[randomValues[i] % chars.length];
    }
    return result;
  }
  for (let i = 0; i < 6; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(encoded: string): string {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
  const binary = atob(base64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

const VALID_CATEGORIES: readonly CategoryId[] = [
  'all',
  'countries',
  'capitals',
  'rivers',
  'monuments',
];
const VALID_DURATIONS: readonly RoundDuration[] = [60, 90, 120];

export function encodeChallengePayload(payload: ChallengePayload): string {
  const safePayload: ChallengePayload = {
    v: 1,
    seed: String(payload.seed).slice(0, 16),
    category: VALID_CATEGORIES.includes(payload.category) ? payload.category : 'all',
    duration: VALID_DURATIONS.includes(payload.duration) ? payload.duration : 90,
    score: Math.max(0, Math.round(payload.score)),
    correct: Math.max(0, Math.round(payload.correct)),
    answered: Math.max(0, Math.round(payload.answered)),
    bestStreak: Math.max(0, Math.round(payload.bestStreak)),
    cluesSaved: Math.max(0, Math.round(payload.cluesSaved)),
    challengerName: (payload.challengerName || '').trim().slice(0, 24),
    createdAt: Math.round(payload.createdAt || Date.now()),
  };
  return toBase64Url(JSON.stringify(safePayload));
}

export function decodeChallengePayload(rawParam: string | null): ChallengePayload | null {
  if (!rawParam || rawParam.length > 512) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(rawParam)) as Partial<ChallengePayload>;
    if (
      !parsed ||
      parsed.v !== 1 ||
      typeof parsed.seed !== 'string' ||
      parsed.seed.trim().length < 2 ||
      !VALID_CATEGORIES.includes(parsed.category as CategoryId) ||
      !VALID_DURATIONS.includes(parsed.duration as RoundDuration) ||
      typeof parsed.score !== 'number' ||
      !Number.isFinite(parsed.score)
    ) {
      return null;
    }
    return {
      v: 1,
      seed: parsed.seed.trim().slice(0, 16),
      category: parsed.category as CategoryId,
      duration: parsed.duration as RoundDuration,
      score: Math.max(0, Math.round(parsed.score)),
      correct: Math.max(0, Math.round(Number(parsed.correct) || 0)),
      answered: Math.max(0, Math.round(Number(parsed.answered) || 0)),
      bestStreak: Math.max(0, Math.round(Number(parsed.bestStreak) || 0)),
      cluesSaved: Math.max(0, Math.round(Number(parsed.cluesSaved) || 0)),
      challengerName:
        typeof parsed.challengerName === 'string'
          ? parsed.challengerName.trim().slice(0, 24)
          : '',
      createdAt:
        typeof parsed.createdAt === 'number' && Number.isFinite(parsed.createdAt)
          ? Math.round(parsed.createdAt)
          : Date.now(),
    };
  } catch {
    return null;
  }
}

export function buildPlayableChallengeUrl(
  payload: ChallengePayload,
  lang: LanguageCode
): string {
  const token = encodeChallengePayload(payload);
  // Use current runtime base when testing in preview/local, and canonical origin in production
  const base =
    typeof window !== 'undefined' && window.location.origin
      ? `${window.location.origin}${window.location.pathname}`
      : `${CANONICAL_ORIGIN}/`;
  const url = new URL(base);
  if (lang !== 'en') {
    url.searchParams.set('lang', lang);
  }
  url.searchParams.set('c', token);
  return url.toString();
}

export function buildCanonicalUrlForLang(lang: LanguageCode): string {
  return lang === 'en' ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}/?lang=${lang}`;
}

export function buildWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
