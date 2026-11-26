import { GEO_BY_ID } from '../data/geoBank';
import type { TranslationBundle } from '../i18n';
import type {
  CategoryId,
  ChallengePayload,
  LocalSaveState,
  RoundDuration,
  RoundQuestionResult,
} from '../types/game';

interface PrintScorecardProps {
  t: TranslationBundle;
  saveState: LocalSaveState;
  latestRound: {
    seed: string;
    category: CategoryId;
    duration: RoundDuration;
    score: number;
    correct: number;
    answered: number;
    bestStreak: number;
    cluesSaved: number;
    results: RoundQuestionResult[];
    duelOpponent: ChallengePayload | null;
  } | null;
}

export function PrintScorecard({ t, saveState, latestRound }: PrintScorecardProps) {
  const playerLabel = saveState.playerName.trim() || t.print.anonymousPlayer;

  return (
    <div className="print-only p-4 text-slate-900">
      <div className="border-b-2 border-slate-900 pb-3">
        <h1 className="font-display text-xl font-bold">{t.print.reportTitle}</h1>
        <p className="mt-1 text-xs text-slate-600">
          {t.print.playerLabel}: <strong>{playerLabel}</strong> · {t.print.generatedOn}:{' '}
          <span className="tabular-nums">{new Date().toISOString().slice(0, 10)}</span>
        </p>
      </div>

      {latestRound && (
        <div className="mt-4">
          <h2 className="font-display text-base font-bold">{t.print.summaryStats}</h2>
          <div className="mt-2 grid grid-cols-4 gap-3 rounded-lg border border-slate-300 p-3 text-xs">
            <div>
              <div className="text-slate-500">{t.summary.finalScore}</div>
              <div className="text-lg font-bold tabular-nums">{latestRound.score}</div>
            </div>
            <div>
              <div className="text-slate-500">{t.summary.accuracy}</div>
              <div className="text-lg font-bold tabular-nums">
                {latestRound.correct}/{latestRound.answered}
              </div>
            </div>
            <div>
              <div className="text-slate-500">{t.summary.bestStreak}</div>
              <div className="text-lg font-bold tabular-nums">{latestRound.bestStreak}</div>
            </div>
            <div>
              <div className="text-slate-500">{t.summary.cluesSaved}</div>
              <div className="text-lg font-bold tabular-nums">{latestRound.cluesSaved}</div>
            </div>
          </div>

          {latestRound.duelOpponent && (
            <div className="mt-3 rounded-lg border border-slate-300 p-3 text-xs">
              <strong>
                {t.setup.targetToBeat} ({latestRound.duelOpponent.challengerName || t.print.anonymousPlayer}):
              </strong>{' '}
              <span className="tabular-nums">{latestRound.duelOpponent.score}</span> {t.records.pts} ·{' '}
              {t.setup.seedLabel}: <span className="font-mono">{latestRound.seed}</span>
            </div>
          )}

          {latestRound.results.length > 0 && (
            <table className="mt-4 w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-400 text-left">
                  <th className="py-1.5">#</th>
                  <th className="py-1.5">{t.records.colCategory}</th>
                  <th className="py-1.5">{t.play.clueLabel}</th>
                  <th className="py-1.5">{t.hud.score}</th>
                </tr>
              </thead>
              <tbody>
                {latestRound.results.map((res, idx) => {
                  const item = GEO_BY_ID[res.itemId];
                  const name = item ? item.translations[t.code].name : res.itemId;
                  return (
                    <tr key={`${res.itemId}-${idx}`} className="border-b border-slate-200">
                      <td className="py-1.5 tabular-nums">{idx + 1}</td>
                      <td className="py-1.5 font-medium">
                        {name} ({t.categories[res.category]})
                      </td>
                      <td className="py-1.5 tabular-nums">{res.cluesUsed}/3</td>
                      <td className="py-1.5 tabular-nums">
                        {res.skipped
                          ? t.play.skippedFeedback
                          : res.isCorrect
                            ? `+${res.pointsEarned}`
                            : '-25'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="mt-5">
        <h2 className="font-display text-sm font-bold">{t.records.bestScoresTitle}</h2>
        <div className="mt-2 grid grid-cols-5 gap-2 text-xs">
          {(['all', 'countries', 'capitals', 'rivers', 'monuments'] as const).map((cat) => (
            <div key={cat} className="rounded border border-slate-300 p-2">
              <div className="text-slate-500">{t.categories[cat]}</div>
              <div className="font-bold tabular-nums">{saveState.bestByCategory[cat]}</div>
            </div>
          ))}
        </div>
      </div>

      {saveState.notes.trim() && (
        <div className="mt-5">
          <h2 className="font-display text-sm font-bold">{t.print.notesHeading}</h2>
          <p className="mt-1 whitespace-pre-wrap rounded border border-slate-300 p-3 text-xs">
            {saveState.notes}
          </p>
        </div>
      )}
    </div>
  );
}
