import { SUPPORTED_LANGUAGES, type LanguageCode } from '../types/game';
import { LANGS_A } from './langsA';
import { LANGS_B } from './langsB';
import type { TranslationBundle } from './types';

export const TRANSLATIONS: Record<LanguageCode, TranslationBundle> = {
  ...LANGS_A,
  ...LANGS_B,
};

const LANG_STORAGE_KEY = 'georushcue_lang';

export function isSupportedLanguage(code: string | null | undefined): code is LanguageCode {
  return Boolean(code && (SUPPORTED_LANGUAGES as readonly string[]).includes(code));
}

export function detectInitialLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'en';

  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get('lang')?.toLowerCase().split('-')[0];
  if (isSupportedLanguage(queryLang)) {
    return queryLang;
  }

  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (isSupportedLanguage(saved)) {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }

  const navLangs =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];
  for (const raw of navLangs) {
    const base = raw?.toLowerCase().split('-')[0];
    if (isSupportedLanguage(base)) {
      return base;
    }
  }

  return 'en';
}

export function persistLanguagePreference(lang: LanguageCode): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore storage errors
  }
}

export type { TranslationBundle };
