# Frontend — Next.js + TypeScript

frontend/
├── public/
│   ├── images/
│   ├── icons/
│   └── banners/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx
│   │   ├── loading.tsx
│   │   │
│   │   ├── (shop)/
│   │   │   ├── layout.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   └── checkout/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   └── account/
│   │       ├── profile/
│   │       │   └── page.tsx
│   │       └── orders/
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── skeleton.tsx
│   │   └── layout/
│   │       ├── header.tsx
│   │       ├── footer.tsx
│   │       └── container.tsx
│   │
│   ├── features/
│   │   ├── products/
│   │   │   ├── components/
│   │   │   │   ├── product-card.tsx
│   │   │   │   ├── product-grid.tsx
│   │   │   │   └── product-filters.tsx
│   │   │   ├── api/
│   │   │   │   └── products.api.ts
│   │   │   ├── hooks/
│   │   │   │   └── use-product-filters.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── components/
│   │   │   ├── cart.store.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── checkout/
│   │   │   ├── components/
│   │   │   ├── checkout.api.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── auth.api.ts
│   │   │   └── types.ts
│   │   │
│   │   └── orders/
│   │       ├── components/
│   │       ├── orders.api.ts
│   │       └── types.ts
│   │
│   ├── lib/
│   │   ├── api-client.ts
│   │   └── env.ts
│   │
│   ├── hooks/
│   │   └── use-debounce.ts
│   │
│   ├── utils/
│   │   └── format-currency.ts
│   │
│   └── types/
│       └── api.ts
│
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json