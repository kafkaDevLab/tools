import type { Language } from '@/lib/locales/types';

export const consultationTranslations: Record<Language, {
  title: string;
  subtitle: string;
  steps: {
    step1: { title: string; description: string };
    step2: { title: string; description: string };
    step3: { title: string; description: string };
    step4: { title: string; description: string };
    step5: { title: string; description: string };
    step6: { title: string; description: string };
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
      name: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      phone: { label: string; placeholder: string };
      content: { label: string; placeholder: string };
      privacy: { label: string; detail: string };
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
}> = {
  ko: {
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
  en: {
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
};
