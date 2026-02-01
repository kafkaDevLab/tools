# tools

## GA4 (Google Analytics 4) 설정

1. **Google Analytics 4 속성 만들기**
   - [Google Analytics](https://analytics.google.com/) 접속 → 관리 → 속성 만들기(또는 기존 GA4 속성 사용)
   - 데이터 스트림에서 **웹** 선택 후 사이트 URL 입력
   - **측정 ID** 확인 (형식: `G-XXXXXXXXXX`)

2. **환경 변수 설정**
   - 로컬: 프로젝트 루트에 `.env.local` 생성
   - Vercel: 프로젝트 → Settings → Environment Variables
   - 변수명: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - 값: 측정 ID (예: `G-XXXXXXXXXX`)

3. **동작**
   - 위 변수가 설정되면 모든 페이지에 gtag.js가 로드되고 페이지뷰가 수집됩니다.
   - 변수가 없으면 GA 스크립트는 추가되지 않습니다.

## Google AdSense

- AdSense 스크립트(`adsbygoogle.js`)가 루트 레이아웃에 포함되어 있습니다.
- 클라이언트 ID 기본값: `ca-pub-1397121992275628` (환경 변수로 덮어쓸 수 있음).
- 다른 퍼블리셔 ID를 쓰려면 환경 변수 `NEXT_PUBLIC_ADSENSE_CLIENT_ID`에 해당 `ca-pub-xxxxxxxx` 값을 설정하세요.