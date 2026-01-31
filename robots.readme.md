# robots.txt 가이드

이 파일은 프로젝트의 `robots.txt` 설정에 대한 가이드입니다.

## 파일 위치

- **소스 파일**: `src/app/robots.ts`
- **생성되는 파일**: `https://your-domain.com/robots.txt`

Next.js App Router에서는 `app/robots.ts` 파일을 통해 동적으로 `robots.txt`를 생성합니다.

## 현재 설정

### 허용된 경로
- 모든 경로 (`/`) - 기본적으로 모든 페이지 인덱싱 허용

### 차단된 경로
- `/admin/` - 관리자 페이지 (인증 필요)
- `/auth/` - 인증 콜백 페이지
- `/api/` - API 엔드포인트
- `/_next/` - Next.js 내부 파일
- `/biz/contacts/` - 연락처 페이지 (개인정보 보호)

## 수정 방법

### 1. 차단할 경로 추가

`src/app/robots.ts` 파일의 `disallow` 배열에 경로를 추가하세요:

```typescript
disallow: [
  '/admin/',
  '/auth/',
  '/api/',
  '/_next/',
  '/biz/contacts/',
  '/your-new-path/',  // 새 경로 추가
],
```

### 2. 특정 경로만 허용

특정 경로만 허용하고 나머지는 차단하려면:

```typescript
rules: [
  {
    userAgent: '*',
    allow: [
      '/',
      '/biz/business/',
      '/biz/complex/',
    ],
    disallow: [
      '/admin/',
      '/auth/',
      // ... 기타 차단 경로
    ],
  },
],
```

### 3. 특정 봇에 대한 규칙 추가

특정 검색 엔진 봇에 대한 규칙을 추가할 수 있습니다:

```typescript
rules: [
  {
    userAgent: '*',
    // ... 기본 규칙
  },
  {
    userAgent: 'Googlebot',
    allow: '/',
    disallow: ['/admin/'],
  },
  {
    userAgent: 'Bingbot',
    allow: '/',
    disallow: ['/admin/', '/test/'],
  },
],
```

### 4. Sitemap URL 변경

Sitemap URL을 변경하려면:

```typescript
sitemap: `${SITE_URL}/sitemap.xml`,
// 또는
sitemap: 'https://your-custom-domain.com/sitemap.xml',
```

## 일반적인 차단 대상

다음과 같은 경로는 일반적으로 차단하는 것이 좋습니다:

- **관리자 페이지**: `/admin/`, `/dashboard/`
- **인증 관련**: `/auth/`, `/login/`, `/signup/`
- **API 엔드포인트**: `/api/`
- **개인정보 페이지**: `/profile/`, `/contacts/`, `/users/`
- **테스트/개발 페이지**: `/test/`, `/dev/`, `/staging/`
- **검색 결과**: `/search?q=*`
- **필터링된 페이지**: `/*?filter=*`, `/*?sort=*`

## 테스트 방법

1. **로컬 테스트**:
   ```bash
   npm run dev
   # 브라우저에서 http://localhost:3000/robots.txt 접속
   ```

2. **프로덕션 테스트**:
   - 배포 후 `https://your-domain.com/robots.txt` 접속
   - Google Search Console에서 robots.txt 테스트 도구 사용

3. **검증 도구**:
   - [Google Search Console](https://search.google.com/search-console)
   - [Bing Webmaster Tools](https://www.bing.com/webmasters)

## 주의사항

1. **경로 끝 슬래시**: 
   - `/admin/`은 `/admin`과 `/admin/*` 모두를 차단합니다
   - `/admin`은 정확히 `/admin`만 차단합니다

2. **와일드카드**:
   - `/*?q=*` - 쿼리 파라미터가 있는 모든 경로 차단
   - `/*/private/` - 모든 경로의 `private` 하위 경로 차단

3. **우선순위**:
   - 더 구체적인 규칙이 먼저 적용됩니다
   - `allow`와 `disallow`가 충돌하면 더 구체적인 규칙이 우선합니다

## 예시 시나리오

### 시나리오 1: 관리자와 API만 차단
```typescript
disallow: [
  '/admin/',
  '/api/',
],
```

### 시나리오 2: 특정 섹션만 허용
```typescript
allow: [
  '/biz/business/',
  '/biz/complex/',
],
disallow: [
  '/',
],
```

### 시나리오 3: 검색 결과 페이지 차단
```typescript
disallow: [
  '/*?q=*',
  '/*?search=*',
  '/*?filter=*',
],
```

## 추가 리소스

- [Next.js Robots 문서](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Google robots.txt 가이드](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt)
- [robots.txt 검증기](https://www.google.com/webmasters/tools/robots-testing-tool)

## 문의

설정에 대한 질문이나 문제가 있으면 개발팀에 문의하세요.

