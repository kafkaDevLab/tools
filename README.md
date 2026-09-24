# MuseDev Tools

Next.js 15 사이트를 Cloudflare Workers에서 실행합니다. 이미지 변환은 Cloudflare Images 바인딩을 사용하고 결과를 저장하지 않습니다. `tools.muse-dev.com`이 공개 도메인입니다.

## 개발 및 검증

Node.js 22 이상이 필요합니다.

```sh
npm ci
npm run dev
npm run cf:typegen
npm run cf:build
npm run cf:preview
```

`npm run cf:preview`는 로컬 Workers 런타임을 사용합니다.

## Cloudflare 리소스와 배포

`wrangler.jsonc`는 다음 전용 리소스에 연결됩니다.

- Worker: `musedev-tools`
- Images 바인딩: `IMAGES`

R2·D1 바인딩은 사용하지 않습니다. 정적 페이지는 Workers Static Assets로 제공하며, 로또 당첨 이력은 브라우저에 최대 한 시간 캐시됩니다. 현재 관리자 페이지가 없고 `/admin/*`는 Access 설정이 없으면 403으로 닫힙니다.

```sh
npm run cf:build
npx wrangler deploy
```

`wrangler.jsonc`의 사용자 지정 도메인은 `tools.muse-dev.com`입니다. 이 저장소에는 DB·파일 저장 기능이나 Supabase 테이블 정의·Storage 사용 코드가 없습니다.

## 이미지 변환

이미지 변환 도구는 최대 20MB를 받으며 Cloudflare Images가 지원하는 JPEG·PNG·WebP·GIF·AVIF로 출력합니다. Cloudflare Images가 TIFF 출력을 지원하지 않아 TIFF 선택지는 제거했습니다. 변환 결과는 사용자의 브라우저로 바로 전달하며 R2에는 저장하지 않습니다.

추가된 이미지 압축·자르기·메타데이터 제거, PDF 합치기·페이지 추출, CSV ↔ JSON, 날짜·영업일, UTM 링크 도구는 브라우저에서만 처리합니다. 파일과 입력값은 서버로 업로드하거나 DB에 저장하지 않습니다. PDF와 사진 정보 처리는 각각 `pdf-lib`, `exifr`를 브라우저에서 사용합니다.

## 검색엔진 및 광고

- 공개 URL은 `src/lib/constants/site.ts`에서 관리합니다. 현재 주소는 `https://tools.muse-dev.com`입니다.
- `/robots.txt`는 `/api/`만 차단합니다. `/sitemap.xml`은 `src/lib/constants/seo.ts`의 `PUBLIC_PATHS`에서 생성합니다.
- 공개 페이지는 각자의 canonical, Open Graph, X 메타데이터를 가집니다. 새 도구에는 `PAGE_SEO`와 `createToolMetadata('/경로')`를 추가하세요.
- 배포 뒤 `robots.txt`와 `sitemap.xml`을 확인하고 Google Search Console에 사이트맵을 제출하세요.
- Cloudflare Web Analytics를 쓰려면 빌드 환경 변수 `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN`에 사이트 토큰을 설정하세요.
- Google AdSense는 광고 송출을 위해 유지합니다. 기본 퍼블리셔 ID는 `ca-pub-1397121992275628`이며 `NEXT_PUBLIC_ADSENSE_CLIENT_ID`로 변경할 수 있습니다.
