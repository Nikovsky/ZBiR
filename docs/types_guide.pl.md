# KONFIGURACJA TYPES + NEST.JS ORAZ TYPES + NEXT.JS

> [!WARNING]
> Tą konfiguracje nalerzy wykonać dopiero po wykonaniu tej instrukcji: [TURBOREPO_GUIDE](./turborepo_guide.pl.md)

## SERVER - NEST.JS
Przykład wykorzystania
```typescript
// @file: apps/server/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserRole } from '@zbir/types'


async function bootstrap() {
  console.log('Test Enum:', UserRole.ADMIN);
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
```

## CLIENT - NEXT.JS
Przykład wykorzystania
```typescript
// @file: apps/client/src/app/page.tsx
import { UserRole } from "@zbir/types";

const userRole: UserRole = UserRole.ADMIN;
export default function Home() {
  {userRole}
}
```

> [!TIP]
> Jeśli `'@zbir/types'` nie jest wykrywana, to najprawdopodobnie nie został jeszcze zbildowany, w takim przypadku należy wykonać taką komende na root directory: `npx turbo run dev` lub tylko zbildować `npx turbo run types:build`
