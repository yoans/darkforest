# Dark Forest Blog Network - Setup Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ and pnpm
- Docker and Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### 1. Clone and Setup
```bash
git clone https://github.com/yourusername/dark-forest-network
cd dark-forest-network

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys
```

### 2. Start Infrastructure
```bash
# Start databases with Docker
docker-compose up -d postgres redis

# Or start everything
docker-compose up -d
```

### 3. Setup Database
```bash
cd packages/database
pnpm run db:push    # Create tables
pnpm run db:seed    # Add sample data
```

### 4. Start Services
```bash
# Development mode (all services)
pnpm run dev

# Or individually:
cd apps/orchestrator && pnpm dev  # Port 3001
cd apps/dashboard && pnpm dev     # Port 3000  
cd apps/agents && pnpm dev        # Background workers
```

### 5. Access Interfaces
- **Dashboard**: http://localhost:3000
- **Orchestrator API**: http://localhost:3001
- **N8N Workflows**: http://localhost:5678 (admin/admin)
- **Database Studio**: `pnpm run db:studio`

## 📋 Detailed Setup

### Environment Configuration

**Required Variables** (add to `.env`):
```env
# Database
DATABASE_URL="postgresql://darkforest:password@localhost:5432/darkforest"
REDIS_URL="redis://localhost:6379"

# AI APIs (at least one required)
OPENAI_API_KEY="sk-your-key-here"
ANTHROPIC_API_KEY="your-anthropic-key"   # Optional

# Basic Auth for N8N
N8N_BASIC_AUTH_USER="admin"
N8N_BASIC_AUTH_PASSWORD="secure-password"
```

### Production Deployment

#### Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway project new dark-forest-network

# Deploy services
railway up --service orchestrator
railway up --service agents  
railway up --service database
```

#### Vercel (Dashboard Only)
```bash
cd apps/dashboard
vercel deploy --prod
```

#### Manual Server
```bash
# Build all services
pnpm run build

# Start in production
NODE_ENV=production pnpm start
```

### Initial Site Configuration

1. **Access Dashboard**: http://localhost:3000
2. **Create First Site**:
   ```json
   {
     "name": "Tech Sustainability Hub",
     "domain": "techsustainability.com", 
     "niche": "sustainable_technology",
     "postsPerWeek": 5,
     "targetAudience": "tech_professionals_25_45",
     "goals": ["organic_traffic", "thought_leadership"],
     "monetization": ["display_ads", "affiliate_marketing"]
   }
   ```

3. **Configure Agents**:
   - Strategy Agent: Market research and content planning
   - Content Agent: Article writing and optimization
   - Publishing Agent: CMS integration and social media
   - Analytics Agent: Performance monitoring and insights

### Workflow Automation

#### N8N Setup
1. Access N8N at http://localhost:5678
2. Import workflows from `integrations/n8n/workflows/`
3. Configure credentials for:
   - Dark Forest API
   - OpenAI API
   - Social media accounts
   - Analytics platforms

#### Daily Automation
The system will automatically:
- ✅ Plan daily content strategy (6 AM)
- ✅ Generate and optimize articles
- ✅ Queue for human approval (if needed)
- ✅ Publish approved content
- ✅ Share on social media
- ✅ Monitor performance
- ✅ Generate insights

### Human Oversight Points

**Automatic Approval** (quality score > 75):
- Standard blog posts
- SEO optimizations  
- Social media posts
- Routine maintenance

**Human Review Required**:
- High-value content (>2000 words)
- Strategy changes
- New monetization approaches
- Crisis management

**Manual Triggers Available**:
- Emergency content pause
- Priority topic injection
- Revenue optimization
- Site-wide changes

### Scaling Your Network

#### Adding New Sites
```bash
# Via Dashboard
POST /api/sites
{
  "name": "Health & Wellness Pro",
  "niche": "health_wellness",
  "template": "blog-template",
  "autoSetup": true
}
```

#### Multi-Niche Strategy
- **Tech**: AI, sustainability, productivity
- **Finance**: Investing, crypto, personal finance  
- **Health**: Fitness, nutrition, mental health
- **Lifestyle**: Travel, food, relationships

#### Revenue Optimization
- Display ads (Google AdSense)
- Affiliate marketing
- Newsletter subscriptions
- Premium content
- Course sales

### Monitoring & Analytics

#### Dashboard Metrics
- Site performance
- Content quality scores
- Agent success rates
- Revenue tracking
- Traffic analytics

#### Alerts & Notifications
- Content approval needed
- Site performance issues
- Revenue anomalies
- Agent failures

### Troubleshooting

#### Common Issues

**Database Connection Error**:
```bash
# Check database status
docker-compose ps postgres
# Reset if needed
docker-compose restart postgres
```

**Agent Not Responding**:
```bash
# Check logs
docker-compose logs agents
# Restart agents
docker-compose restart agents
```

**Low Content Quality**:
- Adjust AI prompts in agent configuration
- Increase human review thresholds
- Add domain-specific training data

**Performance Issues**:
- Scale Redis for queue management
- Add more agent workers
- Optimize database queries
- Use CDN for static content

### Advanced Configuration

#### Custom Agents
Create specialized agents for:
- Niche-specific content
- Advanced SEO strategies
- Custom monetization
- Brand voice consistency

#### API Integration
- CMS platforms (Strapi, Ghost, WordPress)
- Analytics (Google Analytics, Plausible)
- Social media (Twitter, LinkedIn, Facebook)
- SEO tools (SEMrush, Ahrefs)
- Email marketing (ConvertKit, Mailchimp)

#### Backup Strategy
- Automated database backups
- Content version control
- Configuration backups
- Recovery procedures

### Support & Community

- 📖 **Documentation**: Full API docs available
- 🐛 **Issues**: GitHub Issues for bugs
- 💬 **Discord**: Community discussions  
- 📧 **Email**: support@sagaciasoft.com
- 🔄 **Updates**: Automated update notifications

---

**Next Steps:**
1. ✅ Complete basic setup
2. 🎯 Create your first site
3. 📝 Review first AI-generated content
4. 📈 Monitor initial performance
5. 🚀 Scale to multiple sites