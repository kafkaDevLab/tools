export type Language = 'ko' | 'en';

export interface Translations {
  nav: {
    home: string;
    components: string;
    contact: string;
    portfolio: string;
  };
  home: {
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
  };
  examples: {
    title: string;
    description: string;
    sections: {
      scroll: {
        title: string;
        cards: {
          left: {
            title: string;
            subtitle: string;
            content: string;
          };
          right: {
            title: string;
            subtitle: string;
            content: string;
          };
        };
      };
      hover: {
        title: string;
        cards: {
          neon: {
            title: string;
            content: string;
          };
          scale: {
            title: string;
            content: string;
          };
          reactive: {
            title: string;
            content: string;
          };
        };
      };
      tilt3d: {
        title: string;
        description1: string;
        description2: string;
        projects: {
          alpha: {
            title: string;
            content: string;
          };
          beta: {
            title: string;
            content: string;
          };
        };
      };
      scrollText: {
        title: string;
        texts: {
          performance: string;
          speed: string;
          engine: string;
        };
        bento: {
          core: {
            title: string;
            subtitle: string;
          };
          battery: {
            title: string;
            subtitle: string;
          };
          wifi: {
            title: string;
            subtitle: string;
          };
        };
      };
    };
  };
  portfolio: {
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
  };
  consultation: {
    title: string;
    subtitle: string;
    steps: {
      step1: {
        title: string;
        description: string;
      };
      step2: {
        title: string;
        description: string;
      };
      step3: {
        title: string;
        description: string;
      };
      step4: {
        title: string;
        description: string;
      };
      step5: {
        title: string;
        description: string;
      };
      step6: {
        title: string;
        description: string;
      };
    };
    projectTypes: {
      landing: string;
      corporate: string;
      ecommerce: string;
      booking: string;
      other: string;
    };
    pageCounts: {
      one: string;
      five: string;
      fifteen: string;
      twentyPlus: string;
    };
    budgets: {
      under100: string;
      range100to300: string;
      range300to500: string;
      range500to1000: string;
      range1000to3000: string;
      range3000to5000: string;
      over5000: string;
      undecided: string;
    };
    schedules: {
      under3: string;
      range3to6: string;
      range6to9: string;
      over9: string;
    };
    form: {
      referenceSite: {
        title: string;
        placeholder: string;
        helper: string;
        button: string;
      };
      customerInfo: {
        title: string;
        helper: string;
        name: {
          label: string;
          placeholder: string;
        };
        email: {
          label: string;
          placeholder: string;
        };
        phone: {
          label: string;
          placeholder: string;
        };
        content: {
          label: string;
          placeholder: string;
        };
        privacy: {
          label: string;
          detail: string;
        };
      };
      buttons: {
        prev: string;
        next: string;
        submit: string;
        submitting: string;
      };
      messages: {
        success: string;
        error: string;
      };
    };
  };
}

export const translations: Record<Language, Translations> = {
  ko: {
    nav: {
      home: '홈',
      components: '컴포넌트',
      portfolio: '포트폴리오',
      contact: '문의하기',
    },
    home: {
      hero: {
        subtitle: '믿을 수 있는 에이전시',
        // title: '웹의 한계를 넘어',
        // titleHighlight: '새로운 차원을 짓다',
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
    examples: {
      title: 'Interaction Gallery',
      description: 'MuseDEV에서 사용하는 고성능 인터랙션 컴포넌트 모음입니다.\n각 컴포넌트는 재사용 가능하며 독립적으로 동작합니다.',
      sections: {
        scroll: {
          title: '1. Scroll-Triggered Movement',
          cards: {
            left: {
              title: 'Slide From Left',
              subtitle: 'Interaction Type A',
              content: '스크롤이 이 영역에 도달하면 왼쪽에서 부드럽게 나타납니다.',
            },
            right: {
              title: 'Slide From Right',
              subtitle: 'Interaction Type B',
              content: '스크롤이 이 영역에 도달하면 오른쪽에서 부드럽게 나타납니다.',
            },
          },
        },
        hover: {
          title: '2. Advanced Hover Effects',
          cards: {
            neon: {
              title: 'Neon Border',
              content: '마우스를 올리면 그라데이션 테두리가 흐르듯이 나타나며 카드가 살짝 확대됩니다.',
            },
            scale: {
              title: 'Scale & Glow',
              content: '부드러운 스케일 업 애니메이션과 함께 배경색이 은은하게 변화합니다.',
            },
            reactive: {
              title: 'Reactive UI',
              content: '사용자의 행동에 즉각적으로 반응하여 생동감 있는 경험을 제공합니다.',
            },
          },
        },
        tilt3d: {
          title: '3. 3D Physics Tilt',
          description1: '마우스 위치에 따라 카드가 3D 공간에서 회전합니다.\n카드 내부의 요소들도 `translateZ`를 사용하여 깊이감(Depth)을 가집니다.',
          description2: '실제 물리 법칙을 모방한 스프링 애니메이션을 사용하여\n움직임이 기계적이지 않고 매우 자연스럽습니다.',
          projects: {
            alpha: {
              title: 'Project Alpha',
              content: 'Interactive 3D',
            },
            beta: {
              title: 'Project Beta',
              content: 'WebGL Experience',
            },
          },
        },
        scrollText: {
          title: '4. Scroll Text Reveal',
          texts: {
            performance: '믿을 수 없는 성능.',
            speed: '한계를 뛰어넘는 속도.',
            engine: 'MuseDEV M1 엔진 탑재.',
          },
          bento: {
            core: {
              title: 'Supercharged Core',
              subtitle: 'Performance',
            },
            battery: {
              title: 'All Day Battery',
              subtitle: 'Efficiency',
            },
            wifi: {
              title: 'Ultra-Fast 5G',
              subtitle: 'Connectivity',
            },
          },
        },
      },
    },
    portfolio: {
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
    consultation: {
      title: '문의하기',
      subtitle: '프로젝트에 대한 문의사항을 남겨주시면 빠르게 답변드리겠습니다.',
      steps: {
        step1: {
          title: '1. 프로젝트 유형을 선택해주세요.',
          description: '1. 프로젝트 유형',
        },
        step2: {
          title: '2. 예상 페이지 수를 선택해주세요.',
          description: '2. 예상 페이지 수',
        },
        step3: {
          title: '3. 프로젝트의 예산을 선택해주세요.',
          description: '3. 프로젝트 예산 범위',
        },
        step4: {
          title: '4. 프로젝트의 예상 일정을 알려주세요.',
          description: '4. 프로젝트 예상 일정',
        },
        step5: {
          title: '5. 레퍼런스 사이트를 알려주세요.',
          description: '5. 레퍼런스 사이트 주소',
        },
        step6: {
          title: '6. 고객님의 정보를 입력해주세요.',
          description: '6. 고객 정보',
        },
      },
      projectTypes: {
        landing: '랜딩',
        corporate: '기업소개',
        ecommerce: '쇼핑몰',
        booking: '예약시스템',
        other: '기타',
      },
      pageCounts: {
        one: '1페이지',
        five: '5페이지',
        fifteen: '15페이지',
        twentyPlus: '20페이지+',
      },
      budgets: {
        under100: '100만원 미만',
        range100to300: '100-300만원',
        range300to500: '300-500만원',
        range500to1000: '500-1,000만원',
        range1000to3000: '1,000-3,000만원',
        range3000to5000: '3,000-5,000만원',
        over5000: '5,000만원 이상',
        undecided: '미정',
      },
      schedules: {
        under3: '3개월 미만',
        range3to6: '3-6개월',
        range6to9: '6-9개월',
        over9: '9개월 이상',
      },
      form: {
        referenceSite: {
          title: '5. 레퍼런스 사이트를 알려주세요.',
          placeholder: '레퍼런스 사이트 주소',
          helper: '생각하신 레퍼런스 사이트가 없다면 응답을 하지 않으셔도 됩니다.',
          button: '등록하기',
        },
        customerInfo: {
          title: '6. 고객님의 정보를 입력해주세요.',
          helper: '*이 없는 부분은 응답이 필수가 아닙니다.',
          name: {
            label: '이름',
            placeholder: '이름을 입력하세요',
          },
          email: {
            label: '이메일',
            placeholder: '이메일을 입력하세요',
          },
          phone: {
            label: '전화번호',
            placeholder: '전화번호를 입력하세요',
          },
          content: {
            label: '내용',
            placeholder: '문의 내용을 입력하세요 (선택사항)',
          },
          privacy: {
            label: '개인정보 수집 및 이용에 동의합니다.',
            detail: '(수집항목: 이름, 이메일, 전화번호 / 이용목적: 문의 응대)',
          },
        },
        buttons: {
          prev: '이전',
          next: '다음',
          submit: '문의하기',
          submitting: '처리 중...',
        },
        messages: {
          success: '문의가 접수되었습니다.',
          error: '문의 접수에 실패했습니다.',
        },
      },
    },
  },
  en: {
    nav: {
      home: 'Home',
      components: 'Components',
      portfolio: 'Portfolio',
      contact: 'Contact',
    },
    home: {
      hero: {
        subtitle: 'The Future of Web',
        title: 'Web Development',
        titleHighlight: 'You dream it, we build it',
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
    examples: {
      title: 'Interaction Gallery',
      description: 'A collection of high-performance interaction components used by MuseDEV.\nEach component is reusable and operates independently.',
      sections: {
        scroll: {
          title: '1. Scroll-Triggered Movement',
          cards: {
            left: {
              title: 'Slide From Left',
              subtitle: 'Interaction Type A',
              content: 'Smoothly appears from the left when scrolling reaches this area.',
            },
            right: {
              title: 'Slide From Right',
              subtitle: 'Interaction Type B',
              content: 'Smoothly appears from the right when scrolling reaches this area.',
            },
          },
        },
        hover: {
          title: '2. Advanced Hover Effects',
          cards: {
            neon: {
              title: 'Neon Border',
              content: 'A gradient border flows smoothly when hovering, and the card slightly scales up.',
            },
            scale: {
              title: 'Scale & Glow',
              content: 'Smooth scale-up animation with subtle background color changes.',
            },
            reactive: {
              title: 'Reactive UI',
              content: 'Instantly responds to user actions, providing a vibrant experience.',
            },
          },
        },
        tilt3d: {
          title: '3. 3D Physics Tilt',
          description1: 'The card rotates in 3D space based on mouse position.\nElements inside the card also have depth using `translateZ`.',
          description2: 'Uses spring animations that mimic real physics,\nmaking movements natural rather than mechanical.',
          projects: {
            alpha: {
              title: 'Project Alpha',
              content: 'Interactive 3D',
            },
            beta: {
              title: 'Project Beta',
              content: 'WebGL Experience',
            },
          },
        },
        scrollText: {
          title: '4. Scroll Text Reveal',
          texts: {
            performance: 'Unbelievable performance.',
            speed: 'Speed beyond limits.',
            engine: 'Powered by MuseDEV M1 engine.',
          },
          bento: {
            core: {
              title: 'Supercharged Core',
              subtitle: 'Performance',
            },
            battery: {
              title: 'All Day Battery',
              subtitle: 'Efficiency',
            },
            wifi: {
              title: 'Ultra-Fast 5G',
              subtitle: 'Connectivity',
            },
          },
        },
      },
    },
    portfolio: {
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
    consultation: {
      title: 'Contact Us',
      subtitle: 'Please leave your inquiry about the project and we will respond quickly.',
      steps: {
        step1: {
          title: '1. Please select the project type.',
          description: '1. Project Type',
        },
        step2: {
          title: '2. Please select the expected number of pages.',
          description: '2. Expected Number of Pages',
        },
        step3: {
          title: '3. Please select the project budget.',
          description: '3. Project Budget Range',
        },
        step4: {
          title: '4. Please let us know the expected project schedule.',
          description: '4. Expected Project Schedule',
        },
        step5: {
          title: '5. Please provide reference sites.',
          description: '5. Reference Site URL',
        },
        step6: {
          title: '6. Please enter your information.',
          description: '6. Customer Information',
        },
      },
      projectTypes: {
        landing: 'Landing Page',
        corporate: 'Corporate Website',
        ecommerce: 'E-commerce',
        booking: 'Booking System',
        other: 'Other',
      },
      pageCounts: {
        one: '1 Page',
        five: '5 Pages',
        fifteen: '15 Pages',
        twentyPlus: '20+ Pages',
      },
      budgets: {
        under100: 'Under $350',
        range100to300: '$350 - $500',
        range300to500: '$500 - $1,000',
        range500to1000: '$1,000 - $3,000',
        range1000to3000: '$3,000 - $5,000',
        range3000to5000: '$5,000 - $10,000',
        over5000: 'Over $10,000',
        undecided: 'Undecided',
      },
      schedules: {
        under3: 'Under 3 months',
        range3to6: '3-6 months',
        range6to9: '6-9 months',
        over9: 'Over 9 months',
      },
      form: {
        referenceSite: {
          title: '5. Please provide reference sites.',
          placeholder: 'Reference site URL',
          helper: 'If you don\'t have a reference site in mind, you can skip this step.',
          button: 'Submit',
        },
        customerInfo: {
          title: '6. Please enter your information.',
          helper: 'Fields without * are optional.',
          name: {
            label: 'Name',
            placeholder: 'Enter your name',
          },
          email: {
            label: 'Email',
            placeholder: 'Enter your email',
          },
          phone: {
            label: 'Phone',
            placeholder: 'Enter your phone number',
          },
          content: {
            label: 'Message',
            placeholder: 'Enter your inquiry (optional)',
          },
          privacy: {
            label: 'I agree to the collection and use of personal information.',
            detail: '(Collection items: Name, Email, Phone / Purpose: Inquiry response)',
          },
        },
        buttons: {
          prev: 'Previous',
          next: 'Next',
          submit: 'Submit Inquiry',
          submitting: 'Processing...',
        },
        messages: {
          success: 'Your inquiry has been received.',
          error: 'Failed to submit inquiry.',
        },
      },
    },
  },
};
