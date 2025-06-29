# 🚀 Cloud Configuration System

Cloud configuration system built with Hono.js, Prisma, and SQLite for modern developers.

## 🔧 Installation

Install packages with bun:

```bash
bun install
```

Generate Prisma client and push schema to database:

```bash
bun run db:generate
bun run db:push
```

## 🏃‍♂️ Running the Application

Development mode:

```bash
bun run dev
```

Production build and run:

```bash
bun run build
bun start
```

## 💻 API Reference

Base URL: `http://localhost:3000`

### Get all configs for a user

```http
GET /api/configs?user=username
```

| Parameter | Type     | Description                 |
| :-------- | :------- | :-------------------------- |
| `user`    | `string` | **Required**. Your username |

### Get specific config

```http
GET /api/configs/:id
```

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `id`      | `string` | **Required**. Id of config to fetch |

### Create new config

```http
POST /api/configs
```

**Request Body:**

```json
{
  "user": "string",
  "name": "string",
  "content": "string"
}
```

### Update config

```http
PUT /api/configs/:id
```

**Request Body:**

```json
{
  "content": "string"
}
```

### Delete config

```http
DELETE /api/configs/:id
```

## 🏗️ Project Structure

```
src/
├── lib/
│   └── prisma.ts          # Prisma singleton
├── routes/
│   └── configs.ts         # Config routes
├── services/
│   └── config.service.ts  # Business logic
├── types/
│   └── config.types.ts    # TypeScript types
└── index.ts               # Main application
```

## 🛠️ Built With

- [Hono.js](https://hono.dev/) - Fast web framework
- [Prisma](https://prisma.io/) - Database ORM
- [SQLite](https://sqlite.org/) - Database
- [TypeScript](https://typescriptlang.org/) - Type safety
- [Bun](https://bun.sh/) - JavaScript runtime & package manager

open http://localhost:3000
