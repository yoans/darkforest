# 🌲 Dark Forest - Always-On Agentic System

An **always-on autonomous content network** where AI agents operate continuously to create, optimize, and monetize content without human intervention.

## 🎯 Core Philosophy

> The Dark Forest is always watching. Always creating. Always monetizing.

This system is built around three pillars:
- **Always-On**: Agents run continuously - triggered, periodic, or in continuous loops
- **Agentic**: True multi-agent collaboration, not simple API calls
- **Monetizable Content**: Every piece of content is designed for revenue generation

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start the always-on agent system
cd apps/agents && pnpm dev

# Or start with always-on mode enabled
ALWAYS_ON=true TRIGGER_MODE=periodic OPENAI_API_KEY=your-key pnpm dev
```

Open [http://localhost:8916/dashboard](http://localhost:8916/dashboard) to see the Dark Forest in action.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              Dark Forest - Always-On Agentic System            │
├─────────────────────────────────────────────────────────────────┤
│                    AlwaysOnOrchestrator                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │  Periodic Mode  │ │  Event-Driven   │ │ Continuous Mode │   │
│  │  (Cron-based)   │ │  (Webhooks)     │ │    (Loop)       │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                       Agent Network                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Strategy │ │ Content  │ │   SEO    │ │ Research │          │
│  │  Agent   │ │  Agent   │ │  Agent   │ │  Agent   │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │Publishing│ │Analytics │ │Monetize  │ │  Maint.  │          │
│  │  Agent   │ │  Agent   │ │  Agent   │ │  Agent   │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
├─────────────────────────────────────────────────────────────────┤
│                    Content Pipeline                             │
│  Strategy → Research → Content → SEO → Publishing → Analytics  │
└─────────────────────────────────────────────────────────────────┘
```

## 🤖 Agents

| Agent | Purpose | Always-On Mode |
|-------|---------|----------------|
| **Strategy** | Plans content strategy, keyword research | Periodic (every 6 hours) |
| **Content** | Generates SEO-optimized articles | Event-driven (on strategy completion) |
| **Publishing** | Publishes to CMS, generates social posts | Event-driven (on content approval) |
| **SEO** | Optimizes existing content, tracks rankings | Periodic (daily) |
| **Analytics** | Collects performance data, generates insights | Periodic (hourly) |
| **Monetization** | Optimizes ads, affiliate links, revenue | Periodic (daily) |
| **Research** | Gathers trending topics, competitor analysis | Periodic (every 4 hours) |
| **Maintenance** | Health checks, cleanup, optimization | Periodic (daily) |

## ⚙️ Configuration

### Environment Variables

```env
# Required for real AI agents
OPENAI_API_KEY="sk-..."

# Always-On Configuration
ALWAYS_ON=true                    # Enable continuous operation
TRIGGER_MODE=periodic             # periodic | event-driven | continuous
PERIODIC_INTERVAL_MS=3600000      # 1 hour between executions

# Server
PORT=8916
```

### Trigger Modes

1. **Periodic**: Executes content pipeline at regular intervals
2. **Event-Driven**: Waits for external triggers (webhooks, API calls)
3. **Continuous**: Processes tasks from queue in a continuous loop

## 📡 API Endpoints

```bash
# Health check
GET /health

# List all agents
GET /api/agents

# Orchestrator status
GET /api/orchestrator/status

# Trigger content pipeline manually
POST /api/orchestrator/trigger-pipeline

# Queue a task
POST /api/orchestrator/queue-task

# Execute specific agent
POST /api/agents/:agentId/execute
```

## 📁 Project Structure

```
dark-forest/
├── apps/
│   ├── agents/              # 🌲 Core: Always-on agent system
│   ├── orchestrator/        # Scheduler and queue management
│   ├── dashboard/           # Admin web interface
│   └── showcase-blog/       # Blog template
├── packages/
│   └── database/            # Prisma schemas
├── config/
│   └── blog-network-config.json  # Blog network configuration
├── output/                  # Generated content
└── deploy/                  # Deployment files
```

## 🎯 Content Pipeline

When triggered (manually or automatically), the system executes:

1. **Strategy Agent** → Analyzes trends, plans content topics
2. **Content Agent** → Generates SEO-optimized articles
3. **Publishing Agent** → Publishes approved content, generates social posts

Quality gates ensure content meets standards before publishing.

## 🚀 Deployment

The system is designed for always-on deployment:

```bash
# Build for production
pnpm build

# Run in production with always-on mode
ALWAYS_ON=true TRIGGER_MODE=periodic node apps/agents/dist/index.js
```

### GitHub Actions

The included workflow (`generate-and-deploy.yml`) can trigger content generation:
- Manually via workflow dispatch
- On schedule (configurable cron)
- On config changes

## 💰 Monetization

Every piece of content is designed for revenue:
- **Display Ads**: Google AdSense integration
- **Affiliate Links**: Amazon Associates, product recommendations
- **SEO Optimization**: Targeting monetizable keywords
- **Social Sharing**: Driving traffic to monetized content

## 📊 Monitoring

Access the dashboard at `/dashboard` to see:
- Active agents and their status
- Trigger mode and configuration
- Queue length and recent executions
- Manual pipeline trigger

## License

MIT