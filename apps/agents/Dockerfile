FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@8.10.0 --activate
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/agents/package.json apps/agents/
COPY packages/database/package.json packages/database/
RUN pnpm install --frozen-lockfile --filter @dark-forest/agents... 

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/agents/node_modules ./apps/agents/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY apps/agents/ apps/agents/
COPY packages/database/ packages/database/
COPY config/ config/
COPY generators/ generators/
COPY output/ output/
RUN cd packages/database && npx prisma generate
RUN cd apps/agents && npx tsc || true

# Production
FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@8.10.0 --activate
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/agents/dist ./apps/agents/dist
COPY --from=builder /app/apps/agents/package.json ./apps/agents/
COPY --from=builder /app/apps/agents/node_modules ./apps/agents/node_modules
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/config ./config
COPY --from=builder /app/generators ./generators
COPY --from=builder /app/output ./output
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8916

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8916/health || exit 1

CMD ["node", "apps/agents/dist/index.js"]
