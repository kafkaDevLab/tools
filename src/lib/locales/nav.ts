import type { Language } from './types';

export const navTranslations: Record<Language, {
  home: string;
  components: string;
  contact: string;
  portfolio: string;
  faq: string;
}> = {
  ko: {
    home: '홈',
    components: '컴포넌트',
    portfolio: '포트폴리오',
    contact: '문의하기',
    faq: 'FAQ',
  },
  en: {
    home: 'Home',
    components: 'Components',
    portfolio: 'Portfolio',
    contact: 'Contact',
    faq: 'FAQ',
  },
};
