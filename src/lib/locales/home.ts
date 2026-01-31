import type { Language } from './types';

export const homeTranslations: Record<Language, {
  hero: {
    subtitle: string;
    title: string;
    titleHighlight: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: {
    title: string;
    subtitle: string;
    cards: {
      communication: {
        title: string;
        subtitle: string;
        content: string;
      };
      management: {
        title: string;
        subtitle: string;
        content: string;
      };
      seo: {
        title: string;
        subtitle: string;
        content: string;
      };
      maintenance: {
        title: string;
        subtitle: string;
        content: string;
      };
    };
  };
  portfolio: {
    title: string;
    subtitle: string;
    viewMore: string;
    projects: {
      neon: {
        title: string;
        content: string;
      };
      cyber: {
        title: string;
        content: string;
      };
    };
  };
  process: {
    title: string;
    subtitle: string;
    steps: {
      step01: {
        title: string;
        description: string;
      };
      step02: {
        title: string;
        description: string;
      };
      step03: {
        title: string;
        description: string;
      };
      step04: {
        title: string;
        description: string;
      };
      step05: {
        title: string;
        description: string;
      };
    };
  };
  examples: {
    title: string;
    subtitle: string;
    viewMore: string;
  };
  cta: {
    title: string;
    description: string;
    button: string;
    features: {
      freeConsultation: string;
      quickResponse: string;
      customDesign: string;
      maintenance: string;
    };
  };
}> = {
  ko: {
    hero: {
      subtitle: '믿을 수 있는 에이전시',
      title: '홈페이지 제작',
      titleHighlight: '이제 마음 편히 맡겨주세요',
      description: 'MuseDEV는 최신 기술과 반응형 디자인으로 당신의 비즈니스를\n가장 매력적인 디지털 경험으로 전환합니다',
      ctaPrimary: '프로젝트 시작하기',
      ctaSecondary: '포트폴리오 보기',
    },
    services: {
      title: '저희가 약속드리는 4가지',
      subtitle: '책임감과 신뢰를 가장 중요하게 여깁니다',
      cards: {
        communication: {
          title: '소통',
          subtitle: '디자이너, 퍼블리셔, 개발자가 직접 고객과 소통합니다',
          content: '영업 담당자를 거치지 않습니다. 만드는 사람이 직접 상담하기 때문에, 원하시는 의도를 정확히 이해하고 결과물에 반영합니다.',
        },
        management: {
          title: '일정',
          subtitle: '약속된 일정은 반드시 지킵니다',
          content: '정확한 일정을 산출하고, 단계별 진행 상황을 공유해드립니다. 완벽한 결과물을 약속된 날짜에 전달합니다.',
        },
        seo: {
          title: 'SEO',
          subtitle: '검색이 잘 되는 사이트',
          content: '주소를 쳐야만 들어오는 사이트는 의미가 없습니다. 네이버와 구글 검색 결과에 잘 노출되도록 SEO(검색 최적화) 작업을 꼼꼼하게 해드립니다.',
        },
        maintenance: {
          title: '유지보수',
          subtitle: '끝까지 책임지는 파트너',
          content: '사이트 런칭은 끝이 아니라 시작입니다. 운영하시면서 발생하는 문제나 기술적인 어려움에 대해 끝까지 든든한 파트너가 되어 드립니다.',
        },
      },
    },
    portfolio: {
      title: '컴포넌트 조합',
      subtitle: '다양한 컴포넌트를 조합하여 만든 창의적인 결과물을 확인해보세요.',
      viewMore: '더 많은 예시 보기',
      projects: {
        neon: {
          title: 'Neon Commerce',
          content: 'E-Commerce Platform',
        },
        cyber: {
          title: 'Cyber Dashboard',
          content: 'Analytics System',
        },
      },
    },
    process: {
      title: '복잡한 과정 없이, 명확하게 진행됩니다.',
      subtitle: '문의부터 최종 완료까지, 모든 과정은 투명하게 공유됩니다.',
      steps: {
        step01: {
          title: 'STEP 01. 문의 접수',
          description: '홈페이지의 문의 폼을 통해 프로젝트 내용을 남겨주세요. 24시간 이내에 검토 후 연락드립니다.',
        },
        step02: {
          title: 'STEP 02. 상담 및 견적',
          description: '요구사항을 상세히 분석하여, 불필요한 비용을 뺀 합리적인 견적과 개발 방향을 제안합니다.',
        },
        step03: {
          title: 'STEP 03. 계약 및 기획',
          description: '안전한 계약서 작성 후 착수합니다. 화면 설계와 기능 명세를 확정하여 개발 오차를 없앱니다.',
        },
        step04: {
          title: 'STEP 04. 디자인 및 개발',
          description: '확정된 기획을 바탕으로 개발을 진행합니다. 중간 과정을 공유하며 피드백을 반영합니다.',
        },
        step05: {
          title: 'STEP 05. 완료 및 이관',
          description: '철저한 테스트 후 결과물을 전달합니다. 서버 세팅, 소스 코드 이관 등 운영 준비를 마칩니다.\n소스코드는 요청 시 100% 제공합니다.',
        },
      },
    },
    examples: {
      title: '컴포넌트 예시',
      subtitle: 'MuseDEV의 고성능 인터랙션 컴포넌트를 직접 체험해보세요.',
      viewMore: '전체 예시 보기',
    },
    cta: {
      title: '상상을 현실로 만들 준비가 되셨나요?',
      description: 'MuseDEV와 함께라면 불가능은 없습니다.\n지금 바로 프로젝트에 대한 이야기를 들려주세요.',
      button: '문의하기',
      features: {
        freeConsultation: '무료 견적 상담',
        quickResponse: '24시간 이내 응답',
        customDesign: '100% 맞춤형 디자인',
        maintenance: '유지보수 지원',
      },
    },
  },
  en: {
    hero: {
      subtitle: 'The Future of Web',
      title: 'Website Creation',
      titleHighlight: 'Relax and Let Us Handle It',
      description: 'MuseDEV transforms your business into the most captivating digital experience\nwith cutting-edge technology and responsive design.',
      ctaPrimary: 'Start Project',
      ctaSecondary: 'View Portfolio',
    },
    services: {
      title: 'Promises',
      subtitle: '4 Things MuseDev Promises',
      cards: {
        communication: {
          title: 'Communication',
          subtitle: 'Direct communication with designers, developers, and publishers',
          content: 'No sales representatives in between. Since the person who builds your site directly consults with you, we accurately understand your intentions and reflect them in the final product.',
        },
        management: {
          title: 'Schedule',
          subtitle: 'We always keep our promised deadlines',
          content: 'We calculate accurate schedules and share progress at each stage. We deliver perfect results on the promised date.',
        },
        seo: {
          title: 'SEO',
          subtitle: 'Search-optimized website',
          content: 'A website that can only be accessed by typing the address is meaningless. We carefully perform SEO (Search Engine Optimization) work so that your site is well exposed in Naver and Google search results.',
        },
        maintenance: {
          title: 'Maintenance',
          subtitle: 'A reliable partner until the end',
          content: 'Site launch is not the end, but the beginning. We become a reliable partner until the end for any problems or technical difficulties that arise while operating your site.',
        },
      },
    },
    portfolio: {
      title: 'Component Combinations',
      subtitle: 'Discover creative results made by combining various components.',
      viewMore: 'View More Examples',
      projects: {
        neon: {
          title: 'Neon Commerce',
          content: 'E-Commerce Platform',
        },
        cyber: {
          title: 'Cyber Dashboard',
          content: 'Analytics System',
        },
      },
    },
    process: {
      title: 'No complex process, clear progress.',
      subtitle: 'From inquiry to final completion, all processes are shared transparently.',
      steps: {
        step01: {
          title: 'STEP 01. Inquiry',
          description: 'Please leave your project details through the website inquiry form. We will review and contact you within 24 hours.',
        },
        step02: {
          title: 'STEP 02. Consultation & Quote',
          description: 'We analyze your requirements in detail and propose a reasonable quote and development direction without unnecessary costs.',
        },
        step03: {
          title: 'STEP 03. Contract & Planning',
          description: 'After signing a secure contract, we begin. We finalize screen design and feature specifications to eliminate development errors.',
        },
        step04: {
          title: 'STEP 04. Design & Development',
          description: 'We proceed with development based on the confirmed plan. We share the process and incorporate feedback.',
        },
        step05: {
          title: 'STEP 05. Completion & Handover',
          description: 'After thorough testing, we deliver the final product. We complete operational preparations including server setup and source code handover.',
        },
      },
    },
    examples: {
      title: 'Component Examples',
      subtitle: 'Experience MuseDEV\'s high-performance interaction components.',
      viewMore: 'View All Examples',
    },
    cta: {
      title: 'Ready to Turn Imagination into Reality?',
      description: 'With MuseDEV, nothing is impossible.\nTell us about your project right now.',
      button: 'Request Free Consultation',
      features: {
        freeConsultation: 'Free Quote Consultation',
        quickResponse: 'Response Within 24 Hours',
        customDesign: '100% Custom Design',
        maintenance: 'Maintenance Support',
      },
    },
  },
};
