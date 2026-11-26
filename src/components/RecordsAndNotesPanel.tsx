import { useRef, useState } from 'react';
import { Download, Printer, Trash2, Upload } from 'lucide-react';
import type { CategoryId, LocalSaveState } from '../types/game';
import type { TranslationBundle } from '../i18n';
import { exportLocalStateAsJson, sanitizeLocalState } from '../utils/storage';

interface RecordsAndNotesPanelProps {
  t: TranslationBundle;
  saveState: LocalSaveState;
  onUpdateNotes: (notes: string) => void;
  onImportState: (nextState: LocalSaveState) => void;
  onClearHistory: () => void;
  onPrint: () => void;
}

const CATEGORIES_ORDER: readonly CategoryId[] = [
  'all',
  'countries',
  'capitals',
  'rivers',
  'monuments',
];

export function RecordsAndNotesPanel({
  t,
  saveState,
  onUpdateNotes,
  onImportState,
  onClearHistory,
  onPrint,
}: RecordsAndNotesPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = sanitizeLocalState(JSON.parse(text));
      if (!parsed) {
        setImportStatus({ type: 'error', message: t.records.importError });
      } else {
        onImportState(parsed);
        setImportStatus({ type: 'success', message: t.records.importSuccess });
      }
    } catch {
      setImportStatus({ type: 'error', message: t.records.importError });
    } finally {
      e.target.value = '';
    }
  };

  return (
    <section
      id="records"
      className="no-print my-10 rounded-2xl border border-[#E2E8F0] bg-white p-6 md:p-8"
    >
      <div className="mb-6 flex flex-col gap-4 border-b border-[#E2E8F0] pb-5 md:flex-row md:items-center md:justify-between">
        <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
          {t.records.sectionTitle}
        </h2>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => exportLocalStateAsJson(saveState)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#1E40AF] hover:text-[#1E40AF] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {t.records.exportJson}
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#1E40AF] hover:text-[#1E40AF] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            {t.records.importJson}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#1E40AF] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E3A8A] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            {t.records.printBtn}
          </button>
        </div>
      </div>

      {importStatus && (
        <div
          role="status"
          className={`mb-5 rounded-lg border px-4 py-2.5 text-xs font-medium ${
            importStatus.type === 'success'
              ? 'border-[#059669]/30 bg-[#059669]/5 text-[#059669]'
              : 'border-rose-300 bg-rose-50 text-rose-700'
          }`}
        >
          {importStatus.message}
        </div>
      )}

      {/* Personal Bests by Category */}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">{t.records.bestScoresTitle}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES_ORDER.map((cat) => (
            <div
              key={cat}
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
            >
              <div className="text-xs font-medium text-slate-500">{t.categories[cat]}</div>
              <div className="mt-1 font-display text-xl font-bold text-slate-900 tabular-nums">
                {saveState.bestByCategory[cat]}{' '}
                <span className="text-xs font-medium text-slate-500">{t.records.pts}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Recent History Table */}
        <div className="lg:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">{t.records.historyTitle}</h3>
            {saveState.history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-600 whitespace-nowrap cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                {t.records.clearHistory}
              </button>
            )}
          </div>

          {saveState.history.length === 0 ? (
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-sm text-slate-500">
              {t.records.noHistory}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-slate-500">
                  <tr>
                    <th className="px-3.5 py-2.5 font-semibold">{t.records.colCategory}</th>
                    <th className="px-3.5 py-2.5 font-semibold">{t.records.colScore}</th>
                    <th className="px-3.5 py-2.5 font-semibold">{t.records.colAccuracy}</th>
                    <th className="px-3.5 py-2.5 font-semibold">{t.records.colDuel}</th>
                    <th className="px-3.5 py-2.5 font-semibold">{t.records.colDate}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {saveState.history.slice(0, 12).map((row) => (
                    <tr key={row.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-3.5 py-2.5 font-medium text-slate-800 whitespace-nowrap">
                        {t.categories[row.category]} ·{' '}
                        <span className="tabular-nums text-slate-500">
                          {row.duration}
                          {t.setup.secondsSuffix}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {row.score}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-600 tabular-nums whitespace-nowrap">
                        {row.correct}/{row.answered}
                      </td>
                      <td className="px-3.5 py-2.5 tabular-nums whitespace-nowrap">
                        {row.duelOutcome === 'win' && (
                          <span className="font-semibold text-[#059669]">
                            {t.summary.duelWin} ({row.opponentScore})
                          </span>
                        )}
                        {row.duelOutcome === 'tie' && (
                          <span className="font-semibold text-[#1E40AF]">
                            {t.summary.duelTie} ({row.opponentScore})
                          </span>
                        )}
                        {row.duelOutcome === 'loss' && (
                          <span className="font-semibold text-[#D97706]">
                            {t.summary.duelLoss} ({row.opponentScore})
                          </span>
                        )}
                        {!row.duelOutcome && <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-500 tabular-nums whitespace-nowrap">
                        {row.playedAt.slice(0, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Local Notes */}
        <div className="lg:col-span-5">
          <label
            htmlFor="georush-notes"
            className="mb-3 block text-sm font-semibold text-slate-700"
          >
            {t.records.notesTitle}
          </label>
          <textarea
            id="georush-notes"
            rows={7}
            value={saveState.notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            placeholder={t.records.notesPlaceholder}
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1E40AF] focus:bg-white focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
}
