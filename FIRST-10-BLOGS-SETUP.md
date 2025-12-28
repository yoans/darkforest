# 🚀 Your First 10 Blogs: Baby Steps Setup Guide

Welcome! This guide walks you through setting up your AI-powered blog network at `darkforest.sagaciasoft.com/blogname`. Follow each step carefully - we'll guide you through the entire process.

---

## 📋 Table of Contents

1. [What You'll Achieve](#what-youll-achieve)
2. [Prerequisites (5 minutes)](#prerequisites)
3. [Step 1: Essential API Keys](#step-1-essential-api-keys)
4. [Step 2: Research & Trends APIs](#step-2-research--trends-apis)
5. [Step 3: Analytics Integration](#step-3-analytics-integration)
6. [Step 4: Configure Your 10 Blogs](#step-4-configure-your-10-blogs)
7. [Step 5: Deploy to GitHub Pages](#step-5-deploy-to-github-pages)
8. [Step 6: Verify Your Blogs](#step-6-verify-your-blogs)
9. [Troubleshooting](#troubleshooting)

---

## What You'll Achieve

After following this guide, you'll have:

| URL | Blog Name | Niche |
|-----|-----------|-------|
| `darkforest.sagaciasoft.com/ai-business-insights` | AI Business Insights | AI & Business Tech |
| `darkforest.sagaciasoft.com/remote-work-revolution` | Remote Work Revolution | Digital Nomad Lifestyle |
| `darkforest.sagaciasoft.com/cybersecurity-today` | Cybersecurity Today | Security & Privacy |
| `darkforest.sagaciasoft.com/marketing-automation-hub` | Marketing Automation Hub | Marketing & Growth |
| `darkforest.sagaciasoft.com/sustainable-tech-future` | Sustainable Tech Future | Green Technology |
| `darkforest.sagaciasoft.com/personal-finance-mastery` | Personal Finance Mastery | Finance & Investing |
| `darkforest.sagaciasoft.com/health-wellness-hub` | Health & Wellness Hub | Health & Fitness |
| `darkforest.sagaciasoft.com/productivity-hacks` | Productivity Hacks | Productivity & Tools |
| `darkforest.sagaciasoft.com/ecommerce-insights` | E-Commerce Insights | Online Business |
| `darkforest.sagaciasoft.com/creative-ai-studio` | Creative AI Studio | AI in Creative Arts |

---

## Prerequisites

**Time required: 5 minutes**

Before starting, make sure you have:

- [ ] A GitHub account
- [ ] Access to the `yoans/darkforest` repository
- [ ] A credit card for OpenAI (about $20/month)
- [ ] About 30-60 minutes of free time

---

## Step 1: Essential API Keys

### 1.1 OpenAI API Key (REQUIRED - ~$20/month)

This powers all AI content generation.

**Baby Steps:**

1. Open your browser and go to: **https://platform.openai.com/signup**
2. Create an account or sign in with Google
3. Once logged in, click on your profile icon (top right)
4. Click **"View API keys"** or go to: **https://platform.openai.com/api-keys**
5. Click the **"+ Create new secret key"** button
6. Give it a name like `darkforest-blogs`
7. Click **"Create secret key"**
8. **IMPORTANT:** Copy the key immediately! It starts with `sk-proj-...`
9. Save it somewhere safe (password manager recommended)

**Add to GitHub Secrets:**

1. Go to your repository: **https://github.com/yoans/darkforest**
2. Click **Settings** (top right tab)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Name: `OPENAI_API_KEY`
6. Value: Paste your `sk-proj-...` key
7. Click **Add secret**

✅ **Checkpoint:** You should see `OPENAI_API_KEY` in your repository secrets.

---

### 1.2 GitHub Token (ALREADY CONFIGURED)

Good news! GitHub automatically provides `GITHUB_TOKEN` for deployments. No action needed.

---

## Step 2: Research & Trends APIs

These APIs enable your AI agents to research trending topics, analyze competitors, and create relevant content.

### 2.1 Google Search Console (FREE - SEO Research)

**Baby Steps:**

1. Go to: **https://search.google.com/search-console**
2. Click **"Start now"**
3. Choose **"URL prefix"** property type
4. Enter: `https://darkforest.sagaciasoft.com`
5. Click **"Continue"**
6. For verification, choose **"HTML tag"**
7. Copy the meta tag content value (looks like: `abc123xyz...`)
8. Add to GitHub Secrets:
   - Name: `GOOGLE_SITE_VERIFICATION`
   - Value: The verification code

### 2.2 SerpAPI (FREE tier - Trending Topics)

This allows agents to search Google for trending topics and competitor research.

**Baby Steps:**

1. Go to: **https://serpapi.com/**
2. Click **"Register"** (top right)
3. Create account with email or Google
4. Once logged in, go to: **https://serpapi.com/manage-api-key**
5. Copy your API key
6. Add to GitHub Secrets:
   - Name: `SERPAPI_KEY`
   - Value: Your API key

**Free Tier:** 100 searches/month (enough to get started!)

### 2.3 NewsAPI (FREE tier - Current Events)

This helps agents find news and current events for timely content.

**Baby Steps:**

1. Go to: **https://newsapi.org/register**
2. Fill in your details
3. Check your email and verify
4. Go to: **https://newsapi.org/account**
5. Copy your API key
6. Add to GitHub Secrets:
   - Name: `NEWS_API_KEY`
   - Value: Your API key

**Free Tier:** 100 requests/day (developer plan)

### 2.4 Google Trends (No API Key Needed)

The agents can access Google Trends data directly - no configuration needed!

---

## Step 3: Analytics Integration

### 3.1 Google Analytics 4 (FREE - Traffic Tracking)

**Baby Steps:**

1. Go to: **https://analytics.google.com/**
2. Click **"Start measuring"**
3. Create an account named `Dark Forest Network`
4. Create a property named `darkforest.sagaciasoft.com`
5. Configure for "Blog" as industry
6. Click **"Create"**
7. Choose **"Web"** as platform
8. Enter:
   - URL: `https://darkforest.sagaciasoft.com`
   - Stream name: `Dark Forest Main`
9. Click **"Create stream"**
10. Copy the **Measurement ID** (looks like: `G-XXXXXXXXXX`)
11. Add to GitHub Secrets:
    - Name: `GOOGLE_ANALYTICS_ID`
    - Value: `G-XXXXXXXXXX`

### 3.2 Google Tag Manager (OPTIONAL - Advanced Tracking)

Skip this for now - Analytics 4 is sufficient to start.

---

## Step 4: Configure Your 10 Blogs

### 4.1 Environment File Setup

Create a `.env` file in your local repository:

```bash
# Copy the example file
cp .env.example .env

# Edit with your favorite editor
nano .env  # or code .env
```

Add your API keys:

```env
# Required
OPENAI_API_KEY="sk-proj-your-actual-key-here"

# Research & Trends (from Step 2)
SERPAPI_KEY="your-serpapi-key-here"
NEWS_API_KEY="your-newsapi-key-here"
GOOGLE_SITE_VERIFICATION="your-verification-code"

# Analytics (from Step 3)
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Content Generation Settings
POSTS_PER_GENERATION=1
ALWAYS_ON=true
TRIGGER_MODE=periodic
```

### 4.2 Blog Configuration

The 10 blogs are pre-configured in `config/blog-network-config.json`. Here's what each blog covers:

| Blog ID | Focus Area | Target Audience |
|---------|------------|-----------------|
| `ai-business-insights` | AI in enterprise | Business executives |
| `remote-work-revolution` | Remote work tips | Digital nomads, remote workers |
| `cybersecurity-today` | Security news | IT professionals |
| `marketing-automation-hub` | Marketing tools | Marketers, growth hackers |
| `sustainable-tech-future` | Green technology | Eco-conscious tech users |
| `personal-finance-mastery` | Investing, budgets | Young professionals |
| `health-wellness-hub` | Fitness, nutrition | Health enthusiasts |
| `productivity-hacks` | Tools & workflows | Busy professionals |
| `ecommerce-insights` | Online selling | E-commerce entrepreneurs |
| `creative-ai-studio` | AI in art/design | Creatives, designers |

---

## Step 5: Deploy to GitHub Pages

### 5.1 Configure Custom Domain

The CNAME file is already set to `darkforest.sagaciasoft.com`.

**DNS Setup at Your Domain Registrar:**

1. Log in to where you manage `sagaciasoft.com` (GoDaddy, Cloudflare, Namecheap, etc.)
2. Find DNS settings
3. Add these records:

```
Type: CNAME
Name: darkforest
Value: yoans.github.io
TTL: 3600 (or default)
```

Wait 5-30 minutes for DNS propagation.

### 5.2 Enable GitHub Pages

1. Go to: **https://github.com/yoans/darkforest/settings/pages**
2. Under "Source", select: **GitHub Actions**
3. Click **Save**

### 5.3 Set Custom Domain

1. Still in Settings → Pages
2. Under "Custom domain", enter: `darkforest.sagaciasoft.com`
3. Click **Save**
4. Wait for DNS check to pass (may take a few minutes)
5. Check **"Enforce HTTPS"**

### 5.4 Verify Workflow Permissions

1. Go to: **Settings** → **Actions** → **General**
2. Scroll to "Workflow permissions"
3. Select: **Read and write permissions**
4. Check: **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### 5.5 Trigger First Deployment

1. Go to: **https://github.com/yoans/darkforest/actions**
2. Click on **"Generate and Deploy Blog Content"**
3. Click **"Run workflow"** (right side)
4. Select `main` branch
5. Posts per blog: `1` (start small)
6. Click **"Run workflow"**
7. Wait 2-5 minutes for completion

---

## Step 6: Verify Your Blogs

### 6.1 Check Main Site

Open: **https://darkforest.sagaciasoft.com**

You should see the Dark Forest Network homepage with all 10 blogs listed.

### 6.2 Check Individual Blogs

Test each blog URL:

- [ ] `darkforest.sagaciasoft.com/ai-business-insights`
- [ ] `darkforest.sagaciasoft.com/remote-work-revolution`
- [ ] `darkforest.sagaciasoft.com/cybersecurity-today`
- [ ] `darkforest.sagaciasoft.com/marketing-automation-hub`
- [ ] `darkforest.sagaciasoft.com/sustainable-tech-future`
- [ ] `darkforest.sagaciasoft.com/personal-finance-mastery`
- [ ] `darkforest.sagaciasoft.com/health-wellness-hub`
- [ ] `darkforest.sagaciasoft.com/productivity-hacks`
- [ ] `darkforest.sagaciasoft.com/ecommerce-insights`
- [ ] `darkforest.sagaciasoft.com/creative-ai-studio`

### 6.3 Verify Analytics

1. Go to: **https://analytics.google.com**
2. Select your property
3. Open **"Realtime"** view
4. Visit your blog in another tab
5. You should see yourself as an active user!

---

## Troubleshooting

### "OPENAI_API_KEY not set"

**Solution:** Make sure you added the secret correctly:
1. Go to repo Settings → Secrets → Actions
2. Verify `OPENAI_API_KEY` exists
3. Delete and re-add if needed

### "Page not found" on blog URLs

**Solution:** 
1. Check the Actions tab - is deployment complete?
2. Wait 2-3 minutes after deployment
3. Clear browser cache (Ctrl+Shift+R)
4. Check if output folder has blog content

### "DNS not configured" for custom domain

**Solution:**
1. Add CNAME record: `darkforest` → `yoans.github.io`
2. Wait 15-30 minutes for propagation
3. Try: `dig darkforest.sagaciasoft.com` to verify

### No content generating

**Solution:**
1. Check your OpenAI account has credits
2. Verify API key starts with `sk-proj-`
3. Check Actions logs for specific errors

### Slow content generation

**Solution:**
- This is normal! Each post takes 30-60 seconds
- 10 blogs × 1 post = about 10 minutes total
- Be patient on first run

---

## 🎉 What's Next?

After setup is complete:

### Week 1: Foundation
- [ ] Generate 5 posts per blog
- [ ] Share on social media
- [ ] Submit sitemap to Google Search Console

### Week 2: Growth
- [ ] Apply for Google AdSense
- [ ] Set up Amazon Associates
- [ ] Monitor traffic in Analytics

### Month 1: Monetization
- [ ] Enable display ads
- [ ] Add affiliate links
- [ ] Build email list with ConvertKit

### Month 3: Scale
- [ ] Analyze top-performing content
- [ ] Double down on winning niches
- [ ] Consider adding more blogs

---

## 📞 Need Help?

- **GitHub Issues:** Open an issue at [yoans/darkforest](https://github.com/yoans/darkforest/issues)
- **Documentation:** See [README.md](README.md) for technical details
- **API Docs:** See [API-SETUP.md](API-SETUP.md) for service details

---

## 📊 Quick Reference: All API Keys

| Service | Secret Name | Where to Get It | Monthly Cost |
|---------|-------------|-----------------|--------------|
| OpenAI | `OPENAI_API_KEY` | platform.openai.com | ~$20 |
| SerpAPI | `SERPAPI_KEY` | serpapi.com | FREE (100/mo) |
| NewsAPI | `NEWS_API_KEY` | newsapi.org | FREE (100/day) |
| Google Analytics | `GOOGLE_ANALYTICS_ID` | analytics.google.com | FREE |
| Search Console | `GOOGLE_SITE_VERIFICATION` | search.google.com/search-console | FREE |

**Total Monthly Cost: ~$20-25**

---

*Last updated: December 2024*
*The Dark Forest is always watching. Always creating. Always monetizing.* 🌲
