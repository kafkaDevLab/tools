# Public 폴더 구조

이 폴더는 Next.js에서 정적 파일(이미지, 폰트 등)을 제공하는 공용 폴더입니다.

## 폴더 구조

```
public/
├── portfolio/
│   ├── interior/          # 인테리어 포트폴리오 이미지
│   │   ├── portfolio/     # 포트폴리오 아이템 이미지
│   │   └── reviews/       # 고객후기 이미지
│   └── apartment/         # 아파트 포트폴리오 이미지
│       ├── floor-plans/    # 평면도 이미지
│       └── facilities/     # 시설 이미지
└── images/                # 공통 이미지
```

## 사용 방법

### 이미지 추가
1. 해당 포트폴리오 폴더에 이미지 파일을 저장
2. 코드에서 `/portfolio/{portfolio-name}/{image-name}` 형태로 참조

### 예시

```tsx
// 인테리어 포트폴리오 이미지
<img src="/portfolio/interior/hero1.jpg" alt="Hero" />
<img src="/portfolio/interior/portfolio/item1.jpg" alt="Portfolio Item" />

// 아파트 포트폴리오 이미지
<img src="/portfolio/apartment/hero.jpg" alt="Hero" />
<img src="/portfolio/apartment/floor-plans/plan1.jpg" alt="Floor Plan" />

// 공통 이미지
<img src="/images/logo.png" alt="Logo" />
```

## 권장 사항

- 이미지 파일명은 소문자와 하이픈(-) 사용 권장
- 최적화된 이미지 포맷 사용 (WebP, AVIF 권장)
- 적절한 이미지 크기로 리사이즈 후 업로드
- alt 텍스트는 항상 제공
