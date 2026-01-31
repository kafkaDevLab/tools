// 사이트 정보 상수
export const SITE_NAME = 'Daily Tools'
export const SITE_BRAND = 'Daily Tools'
export const SITE_DESCRIPTION = '생활에 도움이 되는 스마트한 도구 모음 | 26주 적금, 로또, 배당금 계산기'
export const SITE_TITLE = 'Daily Tools'
export const SITE_AUTHOR = 'Daily Tools'
export const SITE_CREATOR = 'Daily Tools'
export const SITE_PUBLISHER = 'Daily Tools'
export const SITE_FORMAT_DETECTION = {
  email: false,
  address: false,
  telephone: false,
}
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://daily-tools.com'
export const SITE_OG_IMAGE = `${SITE_URL}/og-image.png`
export const SITE_KEYWORDS = ['Daily Tools', '적금 계산기', '로또 번호', '배당금 계산기', '유틸리티', '금융 도구']

// 카카오톡 채널 URL (설정되지 않으면 undefined)
export const KAKAO_TALK_URL = process.env.NEXT_PUBLIC_KAKAO_TALK_URL || undefined
