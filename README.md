# Financy

Aplicação para organizar finanças: contas de usuário, transações e categorias.

- **backend/**: API GraphQL com TypeScript, Apollo Server, Prisma e SQLite
- **frontend/**: React com Vite, TypeScript, Tailwind e Apollo Client

## Pré-requisitos

- [Bun](https://bun.sh)

## Backend

```bash
cd backend
bun install
cp .env.example .env
bunx prisma migrate dev
bun --watch src/server.ts
```

A API fica em `http://localhost:4000/graphql`.

Variáveis (`backend/.env`):

| Variável       | Exemplo                  |
| -------------- | ------------------------ |
| `JWT_SECRET`   | coloque um segredo longo |
| `DATABASE_URL` | `file:./dev.db`          |
| `PORT`         | `4000`                   |

## Frontend

```bash
cd frontend
bun install
cp .env.example .env
bun run dev
```

A aplicação abre em `http://localhost:5173`.

Variáveis (`frontend/.env`):

| Variável           | Exemplo                         |
| ------------------ | ------------------------------- |
| `VITE_BACKEND_URL` | `http://localhost:4000/graphql` |

## Uso

1. Rode o backend e depois o frontend.
2. Crie uma conta em `/signup` e faça login.
3. Gerencie suas categorias e transações. Cada usuário só vê o que criou.

## NixOS

O Prisma não tem binários para NixOS. Para isso, tem um `shell.nix` com `prisma-engines_6` e que exporta `PRISMA_SCHEMA_ENGINE_BINARY`, `PRISMA_QUERY_ENGINE_BINARY` e `PRISMA_QUERY_ENGINE_LIBRARY` apontando para ele, rode os comandos do backend dentro do `nix-shell`!
