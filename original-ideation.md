I'll architect a complete platform for the Dark Forest autonomous website network.

Now let me create a detailed kickoff implementation plan:

## Phase 1: Foundation (Week 1-2)

**Infrastructure Setup:**
```bash
# Project structure
dark-forest/
├── apps/
│   ├── orchestrator/      # Main control service
│   ├── agents/            # Agent workers
│   ├── dashboard/         # Admin UI
│   └── site-template/     # Next.js site template
├── packages/
│   ├── config/            # Shared config & schemas
│   ├── database/          # Prisma schemas & migrations
│   └── shared/            # Common utilities
└── infrastructure/
    ├── docker-compose.yml
    └── k8s/ (optional)
```

**Initial Setup Tasks:**
1. Set up monorepo (Turborepo or Nx)
2. Deploy PostgreSQL + Redis (Railway/Supabase)
3. Create JSON schema validator
4. Build configuration manager
5. Set up basic orchestrator with health checks

**First Site Config:**
```json
{
  "site_id": "df_001",
  "domain": "tech-sustainability-hub.com",
  "status": "active",
  "goals": {
    "primary": "organic_traffic",
    "monthly_target": 10000
  },
  "flavor": {
    "niche": "sustainable_technology",
    "topics": ["green_energy", "eco_tech", "circular_economy"],
    "tone": "informed_optimist",
    "audience_age": "25-45",
    "content_mix": {
      "news": 0.3,
      "guides": 0.4,
      "opinion": 0.3
    }
  },
  "schedule": {
    "posts_per_day": 2,
    "posting_hours": [9, 15]
  }
}
```

## Phase 2: Agent Development (Week 3-4)

**Agent Priority Order:**
1. **Strategy Agent** (simplest, just planning)
2. **Content Agent** (core value generator)
3. **Publishing Agent** (get content live)
4. **Analytics Agent** (start feedback loop)
5. **Research Agent** (enhance quality)
6. **Maintenance Agent** (automation)

**Strategy Agent MVP:**
```typescript
// Pseudo-code structure
class StrategyAgent {
  async planDaily(siteConfig) {
    // 1. Review yesterday's analytics
    // 2. Check trending topics in niche
    // 3. Generate 3 topic ideas
    // 4. Prioritize by SEO potential
    // 5. Return content brief
  }
}
```

## Phase 3: Site Deployment (Week 5)

**Site Template Features:**
- Next.js 14 with App Router
- Automatic sitemap generation
- RSS feeds
- SEO meta tags from CMS
- Google Analytics integration
- Comment system (optional)
- Email capture

**Deployment Flow:**
1. New site config added → triggers setup
2. Clone template repo
3. Customize with site config
4. Deploy to Vercel
5. Point domain
6. Add to monitoring

## Phase 4: Testing & Tuning (Week 6-7)

**Run with 1-2 sites:**
- Monitor content quality
- Check SEO performance
- Tune agent prompts
- Optimize API costs
- Fix bugs & edge cases

**Success Metrics:**
- Content published daily: ✓
- Zero manual intervention for 7 days: ✓
- Quality score >7/10: ✓
- SEO basics correct: ✓

## Phase 5: Scale (Week 8+)

**Gradually add sites:**
- Start with 5 sites
- Monitor resource usage
- Optimize agent efficiency
- Add new niches
- Scale to 20+ sites

## Critical Implementation Details

### 1. Cost Management
**Budget per site/month:**
- API calls (Claude/GPT): $50-100
- Hosting: $5-10
- Monitoring: $5
- **Total: ~$70/site**

**Optimization:**
- Cache common responses
- Use prompt caching (Anthropic)
- Batch API calls
- Use cheaper models for simple tasks

### 2. Quality Gates
```typescript
const qualityChecks = {
  contentLength: (text) => text.length >= 800,
  readability: (text) => calculateFleschScore(text) > 60,
  uniqueness: (text) => checkPlagiarism(text) > 0.9,
  factCheck: (text) => verifyFactualClaims(text),
  seoScore: (meta) => calculateSEOScore(meta) > 70
};
```

### 3. Failure Handling
- Retry logic with exponential backoff
- Fallback to simpler content generation
- Alert on consecutive failures
- Manual review queue for edge cases

### 4. Learning Loop
```
Analytics → Strategy → Research → Content → Publish
     ↑                                          ↓
     ←──────────── Feedback ←──────────────────┘
```

## Kickoff Checklist

**Day 1-3:**
- [ ] Create GitHub repo with monorepo structure
- [ ] Set up Railway project (DB + Redis)
- [ ] Create first site JSON config
- [ ] Build JSON schema validator
- [ ] Deploy basic orchestrator

**Day 4-7:**
- [ ] Implement Strategy Agent
- [ ] Implement Content Agent (GPT-4 integration)
- [ ] Set up Strapi CMS
- [ ] Deploy first site template
- [ ] Connect agents to CMS

**Day 8-10:**
- [ ] Build Publishing Agent
- [ ] Integrate Google Analytics
- [ ] Set up monitoring (Sentry)
- [ ] Create admin dashboard
- [ ] Test end-to-end workflow

**Day 11-14:**
- [ ] Add Analytics Agent
- [ ] Implement learning feedback
- [ ] Run 7-day autonomous test
- [ ] Document everything
- [ ] Plan second site deployment

## Quick Start Commands

```bash
# Initialize project
npx create-turbo@latest dark-forest
cd dark-forest

# Install dependencies
pnpm install

# Set up database
cd packages/database
npx prisma migrate dev

# Start orchestrator
cd apps/orchestrator
pnpm dev

# Deploy first site
cd apps/site-template
pnpm build
vercel deploy
```

Want me to create the actual orchestrator code, JSON schema definitions, or the first agent implementation to get you started?