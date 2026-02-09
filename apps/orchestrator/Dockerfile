FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@8.10.0 --activate
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/orchestrator/package.json apps/orchestrator/
COPY packages/database/package.json packages/database/
RUN pnpm install --frozen-lockfile --filter @dark-forest/orchestrator...

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/orchestrator/node_modules ./apps/orchestrator/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY apps/orchestrator/ apps/orchestrator/
COPY packages/database/ packages/database/
RUN cd packages/database && npx prisma generate
RUN cd apps/orchestrator && npx tsc || true

# Production
FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@8.10.0 --activate
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/orchestrator/dist ./apps/orchestrator/dist
COPY --from=builder /app/apps/orchestrator/package.json ./apps/orchestrator/
COPY --from=builder /app/apps/orchestrator/node_modules ./apps/orchestrator/node_modules
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "apps/orchestrator/dist/index.js"]
