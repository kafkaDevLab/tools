# Components 구조

이 폴더는 프로젝트에서 사용하는 모든 컴포넌트를 라이브러리별로 구분하여 관리합니다.

## 폴더 구조

```
components/
├── react-bits/          # React Bits 스타일의 순수 UI 컴포넌트
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Card.tsx
│   └── index.ts
│
├── framer-motion/        # Framer Motion을 사용하는 애니메이션 컴포넌트
│   ├── InteractionComponents.tsx
│   ├── AppleInteractions.tsx
│   └── index.ts
│
├── react-three/          # React Three Fiber 관련 3D 컴포넌트
│   ├── AtomHero.tsx
│   └── index.ts
│
├── layout/               # 레이아웃 관련 컴포넌트
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Layout.tsx
│
└── shared/               # 라이브러리 독립적인 공유 컴포넌트
    ├── ConsultationModal.tsx
    └── portfolio/
        ├── PortfolioCard.tsx
        ├── PortfolioFooter.tsx
        └── PortfolioHeader.tsx
```

## 사용 가이드

### React Bits 컴포넌트
```tsx
import { Button, Input, Card } from '@/components/react-bits';

<Button variant="primary" size="lg">클릭</Button>
<Input label="이메일" type="email" />
<Card variant="elevated">내용</Card>
```

### Framer Motion 컴포넌트
```tsx
import { ScrollMoveCard, HoverBorderCard } from '@/components/framer-motion';

<ScrollMoveCard title="제목" content="내용" />
```

### React Three 컴포넌트
```tsx
import { AtomHero } from '@/components/react-three';

<AtomHero />
```

## 원칙

1. **라이브러리별 구분**: 각 컴포넌트는 사용하는 주요 라이브러리 이름으로 폴더를 구분합니다.
2. **재사용성**: 각 폴더의 컴포넌트는 독립적으로 사용 가능해야 합니다.
3. **index.ts**: 각 폴더는 `index.ts`를 통해 export를 관리합니다.
