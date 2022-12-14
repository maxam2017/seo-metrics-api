# SEO Metrics API


## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start
$ pnpm run db:dev:restart

# run prisma studio
$ npx prisma studio

# migrate db
$ npx prisma migrate dev

# watch mode
$ pnpm run start:dev

# production mode
$ docker compose up db -d
$ prisma migrate deploy
$ pnpm run build
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
