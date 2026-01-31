// 통합 번역 파일
// 각 페이지별 번역을 import하여 통합

import type { Language } from './types';
import { navTranslations } from './nav';
import { homeTranslations } from './home';
import { consultationTranslations } from './consultation';
import { examplesTranslations } from './examples';
import { portfolioTranslations } from './portfolio';

// Translations 인터페이스 정의
export interface Translations {
  nav: typeof navTranslations.ko;
  home: typeof homeTranslations.ko;
  consultation: typeof consultationTranslations.ko;
  examples: typeof examplesTranslations.ko;
  portfolio: typeof portfolioTranslations.ko;
}

// 통합 번역 객체
export const translations: Record<Language, Translations> = {
  ko: {
    nav: navTranslations.ko,
    home: homeTranslations.ko,
    consultation: consultationTranslations.ko,
    examples: examplesTranslations.ko,
    portfolio: portfolioTranslations.ko,
  },
  en: {
    nav: navTranslations.en,
    home: homeTranslations.en,
    consultation: consultationTranslations.en,
    examples: examplesTranslations.en,
    portfolio: portfolioTranslations.en,
  },
};

// 타입 export
export type { Language } from './types';
