import { ExternalLink } from 'lucide-react';
import type { TranslationBundle } from '../i18n';

interface AdSlotProps {
  slotId: 'mid-leaderboard' | 'bottom-rectangle';
  label: string;
}

export function MediaNetAdSlot({ slotId, label }: AdSlotProps) {
  const heightClass = slotId === 'mid-leaderboard' ? 'min-h-[100px]' : 'min-h-[250px]';

  return (
    <aside
      aria-label={label}
      className={`no-print my-8 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-center ${heightClass}`}
      data-ad-slot={slotId}
    >
      {/* Media.net Ad Slot: Paste your Media.net <div id="..."> and async script tag inside this container */}
      <span className="text-xs font-medium text-slate-400">{label}</span>
    </aside>
  );
}

interface AffiliateBlockProps {
  t: TranslationBundle;
}

export function AffiliateGearSection({ t }: AffiliateBlockProps) {
  return (
    <section className="no-print my-10 rounded-2xl border border-[#E2E8F0] bg-white p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
            {t.monetization.affiliateHeading}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{t.monetization.affiliateSubheading}</p>
        </div>
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {t.monetization.affiliateDisclosure}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.monetization.affiliateItems.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="group flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-colors hover:border-[#1E40AF] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
          >
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-[#1E40AF]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{item.subtitle}</p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E40AF] whitespace-nowrap">
              {item.cta}
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
