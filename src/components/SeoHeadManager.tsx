import { useEffect } from 'react';
import { CANONICAL_ORIGIN, SUPPORTED_LANGUAGES, type LanguageCode } from '../types/game';
import type { TranslationBundle } from '../i18n';
import { buildCanonicalUrlForLang } from '../utils/challengeLink';

interface SeoHeadManagerProps {
  lang: LanguageCode;
  t: TranslationBundle;
}

function upsertMeta(selector: string, attrName: 'name' | 'property', attrValue: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, hreflang?: string): void {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function SeoHeadManager({ lang, t }: SeoHeadManagerProps) {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', t.isRtl ? 'rtl' : 'ltr');

    const canonicalUrl = buildCanonicalUrlForLang(lang);
    document.title = t.seo.title;

    upsertMeta('meta[name="description"]', 'name', 'description', t.seo.description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', t.seo.title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', t.seo.description);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', t.seo.title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', t.seo.description);

    upsertLink('canonical', canonicalUrl);
    upsertLink('alternate', `${CANONICAL_ORIGIN}/`, 'x-default');
    for (const code of SUPPORTED_LANGUAGES) {
      upsertLink('alternate', buildCanonicalUrlForLang(code), code);
    }

    const jsonLdPayload = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'GeoRushCue',
          url: canonicalUrl,
          applicationCategory: 'GameApplication',
          operatingSystem: 'All',
          inLanguage: [...SUPPORTED_LANGUAGES],
          description: t.seo.description,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@type': 'HowTo',
          name: t.seo.howToTitle,
          step: t.seo.howToSteps.map((s) => ({
            '@type': 'HowToStep',
            name: s.name,
            text: s.text,
          })),
        },
        {
          '@type': 'FAQPage',
          mainEntity: t.editorial.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        },
      ],
    };

    let scriptEl = document.getElementById('georushcue-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'georushcue-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLdPayload);
  }, [lang, t]);

  return null;
}
