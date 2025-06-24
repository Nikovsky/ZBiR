# INSTALACJA
## MONOREPO - TURBOREPO
```powershell
# Utworzenie Turborepo
npx create-turbo@latest zbir --skip-git
cd zbir

# Tworzeni apps/client oraz apps/server
mkdir -p apps/client
mkdir -p apps/server
mkdir -p packages/types
mkdir -p packages/database

# Utworzenie aplikacji Client - NextJS
cd .\apps\client\
npx create-next-app@latest . --skip-git

# Utworzenie aplikacji Server - NestJS
cd ..\server\
npx @nestjs/cli new . --skip-git

# Utworzenie lib dla types
cd ../../packages/types
npm init -y

# Utworzenie lib dla Prisma
cd ../database
npm init -y
```

## KONFIGURACJA TYPES
Utwórz lub uzupełnij pliki:
```json
// @file: packages/types/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "declaration": true,
    "lib": [
      "ES2021"
    ]
  },
  "include": [
    "src"
  ]
}
```

```json
// @file: packages/types/package.json
{
  "name": "@zbir/types",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "types:build": "tsc",
    "dev": "tsc --watch"
  },
  "private": true
}
```
Wykonaj komendę:
```powershell
# <<<POWERSHELL>>>
# zbir/packages/types>
npm install --save-dev typescript
```

> [!IMPORTANT]
> W `index.ts` musi być export inaczej typy nie będą widoczne w aplikacjach po skompilowaniu

```typescript
// @file: packages/types/src/index.ts
export { UserRole } from './user';
```

```typescript
// @file: packages/types/src/user.ts
export enum UserRole {
  ROOT = 'ROOT',
  SYSTEM = 'SYSTEM',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
  GUEST = 'GUEST'
}
```

Wykonaj teraz komendę:
```powershell
# <<<POWERSHELL>>>
# zbir/packages/types>
npm run types:build
```
po wykonaniu tej komendy drzewo plików types powinno wyglądać następująco:

```plaintext
zbir/packages/types
│   package.json
│   tsconfig.json
│   tsconfig.tsbuildinfo
│
├───dist
│       index.d.ts
│       index.js
│       user.d.ts
│       user.js
│
└───src
        index.ts
        user.ts
```

## KONFIGURACJA PRISMA
Utwórz lub uzupełnij pliki:
```json
// @file: packages/database/package.json
{
  "name": "@zbir/database",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "db:build": "tsc",
    "dev": "tsc --watch",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev --skip-generate",
    "db:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",
    "db:reset:force": "prisma migrate reset --force"
  },
  "private": true
}
```

```json
// @file: packages/database/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "composite": true,
    "declaration": true,
    "lib": [
      "ES2021"
    ]
  },
  "include": [
    "src"
  ]
}
```

Wykonaj komendę:
```powershell
# <<<POWERSHELL>>>
# zbir/packages/database>
npm install --save-dev prisma
npm install @prisma/client
npx prisma init
```

Popraw pliki jak potrzeba:
```typescript
// @file: packages/database/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  // output   = "./../generated/client"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

//...
```

```shell
# @file: packages/database/.env
DATABASE_URL="mysql://root:@localhost:3306/zbir"
```

Dodaj pliki do folderu: `src`

```typescript
// @file: packages/database/src/index.ts
export { PrismaService } from './prisma.service';
```

```typescript
// @file: packages/database/src/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
```

Wykonaj teraz komendę:
```powershell
# <<<POWERSHELL>>>
# zbir/packages/database>
npm run db:build
```

po wykonaniu tej komendy drzewo plików types powinno wyglądać następująco:

```plaintext
zbir/packages/database
│   .env
│   package.json
│   tsconfig.json
│   tsconfig.tsbuildinfo
│
├───dist
│       index.d.ts
│       index.js
│       prisma.service.js
│
├───node_modules
│   └───.cache
│       └───prisma
│           └───master
│               └───81e4af48011447c3cc503a190e86995b66d2a28e
│                   └───windows
│                           libquery-engine
│                           libquery-engine.gz.sha256
│                           libquery-engine.sha256
│
├───prisma
│   │   schema.prisma
│   │
│   └───migrations
│       │   migration_lock.toml
│       │
│       └───20250613233256_init_db
│               migration.sql
│
└───src
        index.ts
        prisma.service.ts
```

## KONFIGURACJA TURBO
Edytuj lub utwórz pliki:
```json
// @file: turbo.json
{
  "$schema": "https://turborepo.com/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": [
        "^build"
      ],
      "inputs": [
        "$TURBO_DEFAULT$",
        ".env*"
      ],
      "outputs": [
        ".next/**",
        "!.next/cache/**"
      ]
    },
    "lint": {
      "dependsOn": [
        "^lint"
      ]
    },
    "check-types": {
      "dependsOn": [
        "^check-types"
      ]
    },
    "dev": {
      "dependsOn": [
        "^db:generate",
        "^db:build",
        "^types:build"
      ],
      "cache": false,
      "persistent": true
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false,
      "persistent": true
    },
    "db:deploy": {
      "cache": false
    },
    "db:studio": {
      "cache": false,
      "persistent": true
    },
    "db:reset": {
      "cache": false,
      "persistent": true
    },
    "db:reset:force": {
      "cache": false,
      "persistent": true
    },
    "types:build": {
      "cache": false
    },
    "db:build": {
      "cache": false
    }
  }
}
```

```json
// @file: package.json
{
  "name": "zbir",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "check-types": "turbo run check-types"
  },
  "devDependencies": {
    "@types/glob": "^8.1.0",
    "minimatch": "^9.0.5",
    "prettier": "^3.5.3",
    "turbo": "^2.5.4",
    "typescript": "5.8.2"
  },
  "engines": {
    "node": ">=18"
  },
  "packageManager": "npm@11.4.1",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "dependencies": {
    "@eslint/config-array": "^0.20.1",
    "@eslint/object-schema": "^2.1.6",
    "@prisma/client": "^6.9.0",
    "eslint": "^9.29.0",
    "glob": "^10.4.5",
    "prisma": "^6.9.0",
    "rimraf": "^5.0.10"
  }
}
```

```json
// @file: tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "lib": [
      "ES2021"
    ],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@zbir/types": [
        "packages/types/src"
      ],
      "@zbir/database": [
        "packages/database/src"
      ],
    }
  }
}
```

## KONFIGURACJA CLIENT - NEXT.JS
Edytuj pliki:
```json
// @file: apps/client/package.json
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@zbir/types": "*",      //<<< DODAJ
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "15.3.3"
  },
  "devDependencies": {
    "@zbir/types": "*",      //<<< DODAJ
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.3.3",
    "@eslint/eslintrc": "^3"
  }
}
```

```json
// @file: apps/client/tsconfig.json
{
  "extends": "../../tsconfig.base.json",  //<<< DODAJ
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@types/*": [                     //<<< DODAJ
        "../../packages/types/src/*"    //<<< DODAJ
      ]                                 //<<< DODAJ
    },                                  //<<< DODAJ
    "types": []                         //<<< DODAJ
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

## KONFIGURACJA SERVER - NEST.JS
Edytuj pliki:
```json
// @file: apps/server/package.json
{
  "name": "server",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "dev": "nest start --watch",              //<<< DODAJ
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@zbir/database": "*",                 //<<< DODAJ
    "@zbir/types": "*",                    //<<< DODAJ
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "argon2": "^0.43.0",
    "class-validator": "^0.14.2",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@zbir/database": "*",                 //<<< DODAJ
    "@zbir/types": "*",                    //<<< DODAJ
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/supertest": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^8.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

```json
// @file: apps/server/tsconfig.json
{
  "extends": "../../tsconfig.base.json",        //<<< DODAJ
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "paths": {                                //<<< DODAJ
      "@/*": [                                //<<< DODAJ
        "./src/*"                             //<<< DODAJ
      ]                                       //<<< DODAJ
    }                                         //<<< DODAJ
  },
  "include": [
    "src"
  ]
}
```

## OSTATNI KROK INSTALACJI
Wykonaj teraz komendę:
```powershell
# <<<POWERSHELL>>>
# zbir>
npm install
npx turbo run dev
```

Drzewo twojego repozytorium powinno wyglądać następująco (bez `node_module`, `dist`, `.next`):

```plaintext
ZBIR
│   .gitignore
│   .npmrc
│   package-lock.json
│   package.json
│   README.md
│   tsconfig.base.json
│   turbo.json
│
├───.turbo
│   └───...
│
├───apps
│   ├───client <<< NEXT.JS
│   │   └───...
│   │
│   └───server <<< NEST.JS
│       └───...
│
├───docs
│       turborepo_guide.pl.md
│
└───packages
    ├───database <<< PRISMA
    │   │   .env
    │   │   package.json
    │   │   tsconfig.json
    │   │   tsconfig.tsbuildinfo
    │   │
    │   ├───prisma
    │   │   │   schema.prisma
    │   │   │
    │   │   └───migrations
    │   │       │   migration_lock.toml
    │   │       │
    │   │       └───20250613233256_init_db
    │   │               migration.sql
    │   │
    │   └───src
    │           index.ts
    │           prisma.service.ts
    │
    └───types <<< TYPES
        │   package.json
        │   tsconfig.json
        │   tsconfig.tsbuildinfo
        │
        └───src
                index.ts
                user.ts
```

## NASTĘPNY KROK: [KONFIGURACJA NEST + PRISMA](./db_prisma_guide.pl.md)