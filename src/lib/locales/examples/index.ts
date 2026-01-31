import type { Language } from '@/lib/locales/types';

export const examplesTranslations: Record<Language, {
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
}> = {
  ko: {
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
  en: {
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
};
