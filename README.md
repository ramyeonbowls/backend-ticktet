# bun-starter-no-pania

Backend starter: Bun native + Prisma (SQLite) + JWT access + refresh tokens.

## Setup

1. Install Bun: https://bun.sh
2. Copy `.env.example` → `.env` dan sesuaikan values
3. Install deps:

```bash
10
bun install
```

4. Generate Prisma client & migrate:

```bash
bunx prisma generate
bunx prisma migrate dev --name init
```

5. Run server:

```bash
bun run dev
```

## Endpoints

- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /me (protected)

## Notes

- Use secure cookie in production
- Store secrets in env/secret manager
- Add input validation (Zod) and rate limiting for production
