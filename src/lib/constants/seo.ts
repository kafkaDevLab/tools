/**
 * 페이지별 SEO 메타데이터 (title, description, keywords)
 * 루트 layout의 title template: "%s | Daily Tools" 에 맞춰 title은 짧은 제목만 정의
 */
export interface PageSeo {
  title: string;
  description: string;
  keywords: string[];
}

export const PAGE_SEO: Record<string, PageSeo> = {
  '/': {
    title: 'Daily Tools',
    description:
      '생활·금융·이미지·JSON 등 스마트한 도구 모음. 26주 적금, 로또, 배당금 계산기, 이미지 변환, JSON 포맷터. 회원가입 없이 바로 사용하세요.',
    keywords: [
      'Daily Tools',
      '적금 계산기',
      '로또',
      '배당금 계산기',
      '이미지 변환',
      'JSON 포맷터',
      '무료 도구',
      'webp 변환',
      '이미지 변환',
      '이미지 리사이즈',
      '이미지 크기 조절',
      '이미지 포맷 변환',
      '이미지 포맷 조절',
      '이미지 포맷 조절',
      '카카오 26주 적금',
      '카카오 26주적금 계산기',
      '카카오 26주적금 계산',
      '카카오 26주적금 계산기',
    ],
  },
  '/savings': {
    title: '26주 적금 계산기',
    description:
      '매주 증액되는 26주 적금·풍차돌리기 만기 수령액, 이자·세금을 계산합니다. 일반 모드와 풍차돌리기 모드 지원.',
    keywords: [
      '26주 적금',
      '26주적금 계산기',
      '풍차돌리기',
      '적금 계산기',
      '만기 수령액',
      '카카오 26주 적금',
      '카카오 26주적금 계산기',
      '카카오 26주적금 계산',
      '카카오 26주적금 계산기',
    ],
  },
  '/lotto': {
    title: '로또 번호 추출기',
    description: '행운의 로또 번호를 무작위로 생성합니다. 과학적인(?) 난수로 번호를 추출해보세요.',
    keywords: ['로또 번호', '로또 번호 생성', '로또 추출', '번호 추출기'],
  },
  '/dividend': {
    title: '배당금 계산기',
    description:
      '보유 주식의 연간·월간 예상 배당 수익을 계산합니다. 배당률 또는 주당 배당금 기준으로 입력하세요.',
    keywords: ['배당금 계산기', '배당 수익', '배당률 계산', '주식 배당'],
  },
  '/image-convert': {
    title: '이미지 확장자 변환',
    description:
      'JPG, PNG, WebP, GIF, TIFF, AVIF 등 이미지 포맷을 손쉽게 변환하고 품질을 조절하세요. 여러 장 일괄 변환·ZIP 다운로드 지원.',
    keywords: [
      '이미지 변환',
      'JPG PNG 변환',
      'WebP 변환',
      '이미지 포맷 변환',
    ],
  },
  '/image-resize': {
    title: '이미지 크기 조절',
    description:
      '픽셀·퍼센트·프리셋으로 이미지를 리사이징하세요. 썸네일, 인스타그램, 페이스북, 유튜브 등 SNS 크기 프리셋 지원.',
    keywords: [
      '이미지 리사이즈',
      '이미지 크기 조절',
      '썸네일 크기',
      '인스타그램 크기',
      '페이스북 크기',
      '유튜브 크기',
      '트위터 크기',
      'SNS 크기 프리셋',
      'SNS 크기 조절',
      'SNS 크기 조절',
    ],
  },
  '/json-formatter': {
    title: 'JSON 포맷터·검증기',
    description: 'JSON 데이터를 검증하고 보기 좋게 정렬합니다. 문법 오류 위치 표시, 복사 기능 지원.',
    keywords: ['JSON 포맷터', 'JSON 검증', 'JSON 정렬', 'JSON 포맷'],
  },
};

/** sitemap 등에서 사용할 실제 공개 경로 목록 */
export const PUBLIC_PATHS = Object.keys(PAGE_SEO);
