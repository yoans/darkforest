# 🔑 API Keys & Services Setup Guide

## Quick Start Checklist (Essential Services)

### ✅ **Must Have (Required)**
1. **OpenAI API Key** - For AI content generation
2. **GitHub Personal Access Token** - For automated deployments  
3. **Google Analytics** - For traffic tracking

### 🎯 **High Impact (Recommended)**
4. **Google AdSense** - Primary monetization
5. **Cloudflare** - Free CDN and DNS
6. **Supabase** - Free database hosting

### 📈 **Growth Phase (Later)**
7. **ConvertKit** - Email marketing
8. **Amazon Associates** - Affiliate revenue
9. **Google Search Console** - SEO insights

---

## 🚀 Step-by-Step Setup

### 1. OpenAI API Key (REQUIRED)
**Cost**: ~$20/month for moderate usage
**Purpose**: Powers all AI content generation

```bash
# Go to: https://platform.openai.com/api-keys
# 1. Create account or sign in
# 2. Click "Create new secret key"
# 3. Copy key starting with "sk-"
# 4. Add to .env:
OPENAI_API_KEY="sk-proj-your-key-here"
```

### 2. GitHub Personal Access Token (REQUIRED)
**Cost**: FREE
**Purpose**: Automated blog deployment to GitHub Pages

```bash
# Go to: https://github.com/settings/tokens
# 1. Click "Generate new token (classic)"
# 2. Select these scopes:
#    ☑ repo (Full control of private repositories)
#    ☑ workflow (Update GitHub Action workflows)  
#    ☑ pages (GitHub Pages)
# 3. Copy token starting with "ghp_"
# 4. Add to .env:
GITHUB_TOKEN="ghp_your-token-here"
GITHUB_OWNER="yoans"  # Your GitHub username
```

### 3. Google Analytics 4 (REQUIRED)
**Cost**: FREE
**Purpose**: Track blog traffic and user behavior

```bash
# Go to: https://analytics.google.com/
# 1. Create account or sign in
# 2. Create new property for "darkforest.sagaciasoft.com"
# 3. Copy Measurement ID (format: G-XXXXXXXXXX)
# 4. Add to .env:
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

### 4. Supabase Database (RECOMMENDED)
**Cost**: FREE (500MB storage, 2 projects)
**Purpose**: Stores blog data, analytics, agent tasks

```bash
# Go to: https://supabase.com/dashboard
# 1. Create account with GitHub
# 2. Create new project "darkforest-network"
# 3. Go to Settings > Database
# 4. Copy connection string
# 5. Add to .env:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 5. Upstash Redis (RECOMMENDED) 
**Cost**: FREE (10,000 commands/day)
**Purpose**: Task queue for AI agents

```bash
# Go to: https://console.upstash.com/
# 1. Create account
# 2. Create Redis database
# 3. Copy Redis URL
# 4. Add to .env:
REDIS_URL="rediss://default:[PASSWORD]@[ENDPOINT].upstash.io:6379"
```

### 6. Google AdSense (HIGH PRIORITY)
**Cost**: FREE to join
**Purpose**: Primary blog monetization

```bash
# Go to: https://www.google.com/adsense/
# 1. Create account and verify domain ownership
# 2. Add site for approval
# 3. Get publisher ID (ca-pub-xxxxxxxxxx)
# 4. Add to .env:
GOOGLE_ADSENSE_CLIENT_ID="ca-pub-xxxxxxxxxx"
```

### 7. Cloudflare (RECOMMENDED)
**Cost**: FREE plan available
**Purpose**: CDN, DNS, SSL certificates

```bash
# Go to: https://dash.cloudflare.com/
# 1. Add your domain (darkforest.sagaciasoft.com)
# 2. Update nameservers at your domain registrar
# 3. Go to API Tokens
# 4. Create token with Zone:Edit permissions
# 5. Add to .env:
CLOUDFLARE_API_TOKEN="your-token-here"
CLOUDFLARE_ZONE_ID="your-zone-id"
CUSTOM_DOMAIN="darkforest.sagaciasoft.com"
```

---

## 💰 Monetization Services (Phase 2)

### Amazon Associates (FREE)
```bash
# Go to: https://affiliate-program.amazon.com/
# 1. Apply for affiliate program
# 2. Get your tracking ID (format: yourid-20)
# 3. Add to .env:
AMAZON_ASSOCIATES_TAG="yourid-20"
```

### ConvertKit Email Marketing (1000 subscribers FREE)
```bash
# Go to: https://convertkit.com/
# 1. Create account
# 2. Go to Settings > Advanced > API
# 3. Copy API Key and Secret
# 4. Add to .env:
CONVERTKIT_API_KEY="your-api-key"
CONVERTKIT_SECRET="your-secret"
```

---

## 📊 SEO & Analytics (Phase 3)

### Google Search Console (FREE)
```bash
# Go to: https://search.google.com/search-console
# 1. Add property for your domain
# 2. Verify ownership via DNS or file
# 3. Use with GA4 for complete SEO insights
```

### Ubersuggest (Budget SEO Alternative)
**Cost**: $29/month (much cheaper than SEMrush at $129/month)
```bash
# Go to: https://neilpatel.com/ubersuggest/
# 1. Create account
# 2. Get API access in dashboard
# 3. Add to .env:
UBERSUGGEST_API_KEY="your-api-key"
```

---

## 🎯 Quick Setup Command

Once you have the essential API keys:

```bash
# Copy template
cp .env.example .env

# Edit with your keys
nano .env  # or code .env

# Test setup
pnpm run setup
pnpm run dev
```

---

## 💡 Pro Tips

### Cost Management
- **Start with**: OpenAI ($20) + Domain ($12/year) = ~$32/month
- **Scale to**: Add paid tools as revenue grows
- **ROI Focus**: Each blog should generate 3x its costs

### Security
- Never commit .env files to Git
- Rotate API keys quarterly  
- Use environment-specific keys (dev/prod)
- Monitor API usage to prevent overages

### Performance
- Use Cloudflare for global CDN
- Enable GitHub Pages caching
- Optimize images automatically
- Monitor Core Web Vitals

Ready to proceed with the essential setup? I can help you configure each service step by step!