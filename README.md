# OpenAI's deep research (kinda)

A monorepo project built with modern web technologies for AI research and interaction.

## Tech Stack

### Core Technologies
- **Package Manager**: Bun 1.2.0
- **Monorepo Management**: Turborepo
- **Language**: TypeScript 5.7.3

### Frontend (apps/web)
- **Framework**: React 19
- **Routing**: React Router 7
- **UI Components**:
  - @shadcn/ui
  - Mantine Hooks
  - Tailwind CSS 4
- **Data Management**: TanStack Query (React Query) 5
- **API Integration**: tRPC 11
- **Testing**:
  - Vitest
  - Playwright
  - Testing Library

### Backend (apps/server)
- **Runtime**: Bun
- **API Framework**: Hono
- **Database**: LibSQL (bun)
- **ORM**: Drizzle
- **AI Integration**:
  - OpenAI SDK
  - LangChain
  - Mendable Firecrawl

## Getting Started

1. Install dependencies:
```bash
bun install
```

2. Environment Setup:
   Copy the `.env-example` file in the `apps/server` directory to `.env.local` and fill in the following variables:

```env
DATABASE_URL="db.sqlite"      # Your database connection string
OPENAI_API_KEY=""            # Your OpenAI API key
OPENAI_MODEL="gpt-4o-mini"   # OpenAI model to use
FIRECRAWL_KEY=""            # Your Firecrawl API key
```

3. Development:
```bash
# Start all services
bun run dev

# Run tests
bun run test

# Type checking
bun run typecheck
```

## Project Structure

```
.
├── apps/
│   ├── web/        # Frontend application
│   └── server/     # Backend API server
└── package.json    # Root workspace configuration
```

## Available Scripts

- `build`: Build all applications
- `dev`: Start development servers
- `lint`: Run Biome linter
- `test`: Run test suites
- `test:integration`: Run browser integration tests

## Database Management

The server app includes Drizzle ORM for database management. Use these commands in the server directory:

```bash
cd apps/server
bun run drizzle-kit # For database migrations
bun run studio      # For database management UI
```

