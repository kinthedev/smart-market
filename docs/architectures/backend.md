# Backend — Node.js + Express + TypeScript + Prisma

backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   └── cors.ts
│   │
│   ├── middlewares/
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── validate-request.ts
│   │   ├── not-found.ts
│   │   └── error-handler.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.schema.ts
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── users/
│   │   │   ├── user.route.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   └── user.schema.ts
│   │   │
│   │   ├── products/
│   │   │   ├── product.route.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   ├── product.repository.ts
│   │   │   ├── product.schema.ts
│   │   │   └── product.types.ts
│   │   │
│   │   ├── categories/
│   │   │   ├── category.route.ts
│   │   │   ├── category.controller.ts
│   │   │   ├── category.service.ts
│   │   │   └── category.schema.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── cart.route.ts
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.service.ts
│   │   │   └── cart.schema.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── order.route.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   │   ├── order.repository.ts
│   │   │   ├── order.schema.ts
│   │   │   └── order.types.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── payment.route.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.service.ts
│   │   │   └── providers/
│   │   │
│   │   └── admin/
│   │       ├── admin.route.ts
│   │       └── admin.controller.ts
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── logger.ts
│   │
│   ├── utils/
│   │   └── pagination.ts
│   │
│   └── types/
│       └── express.d.ts
│
├── tests/
│   ├── integration/
│   └── helpers/
│
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json