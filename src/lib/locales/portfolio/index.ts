import type { Language } from '@/lib/locales/types';

export const portfolioTranslations: Record<Language, {
  title: string;
  subtitle: string;
  filters: {
    all: string;
    website: string;
    mobile: string;
  };
  items: {
    techcorp: {
      title: string;
      description: string;
      type: string;
      tags: string[];
      url: string;
    };
    workify: {
      title: string;
      description: string;
      type: string;
      tags: string[];
      url: string;
    };
  };
  noProjects: string;
}> = {
  ko: {
    title: 'Portfolio',
    subtitle: '우리가 만든 프로젝트들을 만나보세요',
    filters: {
      all: '전체',
      website: '웹사이트',
      mobile: '모바일 앱',
    },
    items: {
      techcorp: {
        title: '세련된 기업',
        description: '신뢰와 전문성을 담은 한국형 기업 웹사이트. 깔끔하고 정돈된 비즈니스 사이트.',
        type: 'website',
        tags: ['React', 'TypeScript', 'Corporate Design'],
        url: 'https://example.com',
      },
      workify: {
        title: '혁신적인 스타트업',
        description: 'AI와 테크놀로지를 전면에 내세운 IT 스타트업. 미니멀하면서도 임팩트 있는 디자인.',
        type: 'mobile',
        tags: ['React', 'Framer Motion', 'Modern UI'],
        url: 'https://example.com',
      },
    },
    noProjects: '이 카테고리에 프로젝트가 없습니다.',
  },
  en: {
    title: 'Portfolio',
    subtitle: 'Discover the projects we\'ve created',
    filters: {
      all: 'All',
      website: 'Website',
      mobile: 'Mobile App',
    },
    items: {
      techcorp: {
        title: 'Sophisticated Enterprise',
        description: 'A Korean-style corporate website embodying trust and professionalism. A clean and organized business site.',
        type: 'website',
        tags: ['React', 'TypeScript', 'Corporate Design'],
        url: 'https://example.com',
      },
      workify: {
        title: 'Innovative Startup',
        description: 'An IT startup that puts AI and technology at the forefront. Minimal yet impactful design.',
        type: 'mobile',
        tags: ['React', 'Framer Motion', 'Modern UI'],
        url: 'https://example.com',
      },
    },
    noProjects: 'No projects found in this category.',
  },
};
