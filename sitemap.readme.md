# sitemap.xml 가이드

이 파일은 프로젝트의 `sitemap.xml` 설정에 대한 가이드입니다.

## 파일 위치

- **소스 파일**: `src/app/sitemap.ts`
- **생성되는 파일**: `https://your-domain.com/sitemap.xml`

Next.js App Router에서는 `app/sitemap.ts` 파일을 통해 동적으로 `sitemap.xml`을 생성합니다.

## 현재 설정

### 포함된 페이지

1. **홈 페이지** (`/`)
   - 우선순위: 1.0 (최고)
   - 변경 빈도: daily (매일)

2. **메인 메뉴 페이지** (서브메뉴가 있는 경우)
   - 우선순위: 0.7
   - 변경 빈도: weekly (주간)

3. **서브메뉴 페이지**
   - 우선순위: 0.8
   - 변경 빈도: weekly (주간)

4. **공개 추가 페이지**
   - 관심고객 등록 (`/biz/contacts/new`)
   - 우선순위: 0.6
   - 변경 빈도: monthly (월간)

### 제외된 페이지

다음 페이지는 robots.txt에서 차단되므로 sitemap에도 포함되지 않습니다:

- `/admin/` - 관리자 페이지
- `/auth/` - 인증 관련 페이지
- `/api/` - API 엔드포인트
- `/biz/contacts/` - 연락처 목록 (개인정보 보호)

## 수정 방법

### 1. 페이지 추가

`sitemap.ts` 파일의 `routes` 배열에 새 페이지를 추가하세요:

```typescript
routes.push({
  url: `${baseUrl}/your-new-page`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.8,
})
```

### 2. 우선순위 (Priority) 조정

우선순위는 0.0 ~ 1.0 사이의 값입니다:

- **1.0**: 홈 페이지 (최고 우선순위)
- **0.8 ~ 0.9**: 주요 콘텐츠 페이지
- **0.6 ~ 0.7**: 일반 페이지
- **0.3 ~ 0.5**: 덜 중요한 페이지

```typescript
{
  url: `${baseUrl}/important-page`,
  priority: 0.9, // 높은 우선순위
}
```

### 3. 변경 빈도 (Change Frequency) 설정

변경 빈도는 검색 엔진에 페이지 업데이트 주기를 알려줍니다:

- **always**: 항상 변경됨 (거의 사용하지 않음)
- **hourly**: 매시간
- **daily**: 매일
- **weekly**: 주간 (기본값)
- **monthly**: 월간
- **yearly**: 연간
- **never**: 변경되지 않음

```typescript
{
  url: `${baseUrl}/news-page`,
  changeFrequency: 'daily', // 매일 업데이트
}
```

### 4. lastModified 날짜 설정

페이지의 마지막 수정 날짜를 설정할 수 있습니다:

```typescript
{
  url: `${baseUrl}/page`,
  lastModified: new Date('2024-01-15'), // 특정 날짜
  // 또는
  lastModified: new Date(), // 현재 날짜
}
```

### 5. 동적 페이지 추가

데이터베이스나 API에서 가져온 동적 페이지를 추가할 수 있습니다:

```typescript
// 예시: 블로그 포스트
const blogPosts = await fetchBlogPosts()
blogPosts.forEach((post) => {
  routes.push({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  })
})
```

### 6. 특정 페이지 제외

특정 경로를 제외하려면 필터링을 추가하세요:

```typescript
menuItem.submenu.forEach((submenu) => {
  // 특정 경로 제외
  if (submenu.path === '/biz/excluded-page') {
    return
  }
  
  routes.push({
    url: `${baseUrl}${submenu.path}`,
    // ...
  })
})
```

## 우선순위 가이드

일반적인 우선순위 설정:

| 페이지 유형 | 우선순위 | 예시 |
|------------|---------|------|
| 홈 페이지 | 1.0 | `/` |
| 주요 랜딩 페이지 | 0.9 | `/biz/business/overview` |
| 카테고리 페이지 | 0.8 | `/biz/business/brand` |
| 상세 페이지 | 0.7 | `/biz/unit/72` |
| 보조 페이지 | 0.6 | `/biz/contacts/new` |
| 아카이브 페이지 | 0.5 | `/biz/promotion/news` |
| 태그 페이지 | 0.4 | - |
| 검색 결과 | 0.3 | - |

## 변경 빈도 가이드

일반적인 변경 빈도 설정:

| 콘텐츠 유형 | 변경 빈도 | 예시 |
|-----------|---------|------|
| 뉴스/블로그 | daily | `/biz/promotion/news` |
| 제품 페이지 | weekly | `/biz/unit/72` |
| 정적 페이지 | monthly | `/biz/business/overview` |
| 아카이브 | yearly | - |
| 변경 없음 | never | - |

## 테스트 방법

1. **로컬 테스트**:
   ```bash
   npm run dev
   # 브라우저에서 http://localhost:3000/sitemap.xml 접속
   ```

2. **프로덕션 테스트**:
   - 배포 후 `https://your-domain.com/sitemap.xml` 접속
   - XML 형식이 올바른지 확인

3. **검증 도구**:
   - [Google Search Console](https://search.google.com/search-console)
     - Sitemaps 섹션에서 sitemap 제출 및 테스트
   - [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
   - [Bing Webmaster Tools](https://www.bing.com/webmasters)

4. **명령줄 검증**:
   ```bash
   # XML 형식 검증
   xmllint --noout sitemap.xml
   ```

## Google Search Console에 제출

1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 선택
3. 좌측 메뉴에서 "Sitemaps" 클릭
4. "새 사이트맵 추가" 클릭
5. `sitemap.xml` 입력 후 제출

## 주의사항

1. **URL 형식**:
   - 모든 URL은 절대 경로여야 합니다
   - `https://` 또는 `http://`로 시작해야 합니다
   - 끝에 슬래시(`/`)는 일관되게 유지하세요

2. **파일 크기 제한**:
   - 단일 sitemap 파일은 최대 50MB
   - 최대 50,000개 URL
   - 초과 시 sitemap 인덱스 파일 사용

3. **업데이트 주기**:
   - 콘텐츠가 자주 변경되면 `lastModified`를 정기적으로 업데이트
   - 빌드 시점에 자동으로 업데이트되도록 설정 권장

4. **중복 URL 방지**:
   - 같은 URL이 여러 번 포함되지 않도록 주의
   - 정규화된 URL 사용 (예: `/page`와 `/page/` 중 하나로 통일)

## Sitemap 인덱스 파일 (대용량 사이트용)

50,000개 이상의 URL이 있으면 sitemap 인덱스 파일을 사용하세요:

```typescript
// sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/sitemap-pages.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-posts.xml`,
      lastModified: new Date(),
    },
  ]
}
```

## 예시 시나리오

### 시나리오 1: 블로그 포스트 추가

```typescript
// 데이터베이스에서 블로그 포스트 가져오기
const posts = await getBlogPosts()

posts.forEach((post) => {
  routes.push({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  })
})
```

### 시나리오 2: 제품 페이지 추가

```typescript
const products = await getProducts()

products.forEach((product) => {
  routes.push({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(product.lastModified),
    changeFrequency: 'monthly',
    priority: 0.8,
  })
})
```

### 시나리오 3: 특정 카테고리만 높은 우선순위

```typescript
menuItem.submenu.forEach((submenu) => {
  const isImportant = submenu.path.includes('/business/')
  
  routes.push({
    url: `${baseUrl}${submenu.path}`,
    priority: isImportant ? 0.9 : 0.7,
    changeFrequency: 'weekly',
    lastModified: new Date(),
  })
})
```

## 추가 리소스

- [Next.js Sitemap 문서](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google Sitemap 가이드](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Sitemap 프로토콜](https://www.sitemaps.org/protocol.html)

## 문의

설정에 대한 질문이나 문제가 있으면 개발팀에 문의하세요.

