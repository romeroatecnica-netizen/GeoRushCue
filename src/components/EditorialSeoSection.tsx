import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import type { TranslationBundle } from '../i18n';

interface EditorialSeoSectionProps {
  t: TranslationBundle;
}

export function EditorialSeoSection({ t }: EditorialSeoSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="duel-guide"
      className="no-print my-10 space-y-10 rounded-2xl border border-[#E2E8F0] bg-white p-6 md:p-8"
    >
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          {t.editorial.sectionTitle}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {t.editorial.blocks.map((block, idx) => (
            <article
              key={idx}
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5"
            >
              <h3 className="font-display text-base font-bold text-slate-900">
                {block.heading}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{block.body}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Interactive Expandable FAQ */}
      <div id="faq" className="border-t border-[#E2E8F0] pt-8">
        <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
          {t.editorial.faqTitle}
        </h2>
        <div className="mt-4 divide-y divide-[#E2E8F0] rounded-xl border border-[#E2E8F0]">
          {t.editorial.faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-white first:rounded-t-xl last:rounded-b-xl">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-sm font-semibold text-slate-900 transition-colors hover:bg-[#F8FAFC] cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3.5 text-sm leading-relaxed text-slate-600">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparent Client-Side Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs leading-relaxed text-slate-600">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1E40AF]" aria-hidden="true" />
        <p>{t.editorial.transparentNotice}</p>
      </div>
    </section>
  );
}
