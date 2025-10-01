# Dark Forest Blog Network

An autonomous blog network where AI agents handle everything from ideation to monetization.

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup database
pnpm run setup

# Start all services in development
pnpm run dev
```

## Project Structure

```
dark-forest-network/
├── apps/
│   ├── orchestrator/        # Central coordination service
│   ├── dashboard/           # Admin web interface  
│   ├── agents/              # AI agent workers
│   └── blog-template/       # Next.js blog template
├── packages/
│   ├── database/            # Prisma schemas & migrations
│   ├── config/              # Shared configuration
│   ├── shared/              # Common utilities
│   └── types/               # TypeScript definitions
└── infrastructure/
    ├── docker-compose.yml   # Local development
    └── deploy/              # Production deployment
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

## Development

Each service can be run independently:

```bash
# Run orchestrator
cd apps/orchestrator && pnpm dev

# Run dashboard  
cd apps/dashboard && pnpm dev

# Run agents
cd apps/agents && pnpm dev
```

## Deployment

- **Orchestrator & Agents**: Railway
- **Dashboard**: Vercel  
- **Blog Sites**: Vercel
- **Database**: Railway PostgreSQL
- **Cache**: Railway Redis

## Environment Setup

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."

# AI APIs
OPENAI_API_KEY="..."
ANTHROPIC_API_KEY="..."

# Services
STRAPI_URL="..."
ANALYTICS_API_KEY="..."
```

## License

MIT