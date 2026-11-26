import type { CategoryId, LocalSaveState, SavedRoundRecord } from '../types/game';

const STORAGE_KEY = 'georushcue_v1_state';

export const DEFAULT_LOCAL_STATE: LocalSaveState = {
  version: 1,
  playerName: '',
  soundEnabled: true,
  notes: '',
  bestByCategory: {
    all: 0,
    countries: 0,
    capitals: 0,
    rivers: 0,
    monuments: 0,
  },
  history: [],
};

const VALID_CATEGORIES: readonly CategoryId[] = [
  'all',
  'countries',
  'capitals',
  'rivers',
  'monuments',
];

export function sanitizeLocalState(raw: unknown): LocalSaveState | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const bestRaw = (obj.bestByCategory && typeof obj.bestByCategory === 'object'
    ? obj.bestByCategory
    : {}) as Record<string, unknown>;

  const bestByCategory: Record<CategoryId, number> = {
    all: Math.max(0, Math.round(Number(bestRaw.all) || 0)),
    countries: Math.max(0, Math.round(Number(bestRaw.countries) || 0)),
    capitals: Math.max(0, Math.round(Number(bestRaw.capitals) || 0)),
    rivers: Math.max(0, Math.round(Number(bestRaw.rivers) || 0)),
    monuments: Math.max(0, Math.round(Number(bestRaw.monuments) || 0)),
  };

  const historyRaw = Array.isArray(obj.history) ? obj.history : [];
  const history: SavedRoundRecord[] = [];
  for (const entry of historyRaw.slice(0, 60)) {
    if (!entry || typeof entry !== 'object') continue;
    const r = entry as Record<string, unknown>;
    const cat = VALID_CATEGORIES.includes(r.category as CategoryId)
      ? (r.category as CategoryId)
      : 'all';
    const dur = r.duration === 60 || r.duration === 90 || r.duration === 120 ? r.duration : 90;
    history.push({
      id: typeof r.id === 'string' ? r.id.slice(0, 40) : `rec_${history.length}`,
      seed: typeof r.seed === 'string' ? r.seed.slice(0, 16) : 'GEOCUE',
      category: cat,
      duration: dur,
      score: Math.max(0, Math.round(Number(r.score) || 0)),
      correct: Math.max(0, Math.round(Number(r.correct) || 0)),
      answered: Math.max(0, Math.round(Number(r.answered) || 0)),
      bestStreak: Math.max(0, Math.round(Number(r.bestStreak) || 0)),
      cluesSaved: Math.max(0, Math.round(Number(r.cluesSaved) || 0)),
      playedAt: typeof r.playedAt === 'string' ? r.playedAt : new Date().toISOString(),
      opponentScore:
        typeof r.opponentScore === 'number' && Number.isFinite(r.opponentScore)
          ? Math.max(0, Math.round(r.opponentScore))
          : undefined,
      opponentName:
        typeof r.opponentName === 'string' ? r.opponentName.slice(0, 24) : undefined,
      duelOutcome:
        r.duelOutcome === 'win' || r.duelOutcome === 'tie' || r.duelOutcome === 'loss'
          ? r.duelOutcome
          : undefined,
    });
  }

  return {
    version: 1,
    playerName: typeof obj.playerName === 'string' ? obj.playerName.slice(0, 24) : '',
    soundEnabled: typeof obj.soundEnabled === 'boolean' ? obj.soundEnabled : true,
    notes: typeof obj.notes === 'string' ? obj.notes.slice(0, 4000) : '',
    bestByCategory,
    history,
  };
}

export function loadLocalState(): LocalSaveState {
  if (typeof window === 'undefined') return DEFAULT_LOCAL_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LOCAL_STATE;
    const parsed = sanitizeLocalState(JSON.parse(raw));
    return parsed || DEFAULT_LOCAL_STATE;
  } catch {
    return DEFAULT_LOCAL_STATE;
  }
}

export function saveLocalState(state: LocalSaveState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors gracefully
  }
}

export function exportLocalStateAsJson(state: LocalSaveState): void {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `georushcue-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
