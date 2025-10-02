# 🚀 GitHub Pages Deployment Guide

## Step 1: Required GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets one by one:

### Essential Secrets (Required for basic deployment)

| Secret Name | Description | Where to Get It | Example |
|-------------|-------------|-----------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for content generation | https://platform.openai.com/api-keys | `sk-proj-...` |

### Optional Secrets (For analytics and monetization)

| Secret Name | Description | Where to Get It | Example |
|-------------|-------------|-----------------|---------|
| `GOOGLE_ANALYTICS_ID` | Google Analytics tracking ID | https://analytics.google.com | `G-XXXXXXXXXX` |
| `GOOGLE_ADSENSE_PUBLISHER_ID` | AdSense Publisher ID | https://adsense.google.com | `ca-pub-XXXXXXXXXXXXXXXX` |
| `AMAZON_ASSOCIATE_ID` | Amazon Associates ID | https://affiliate-program.amazon.com | `your-id-20` |

### Advanced Secrets (Optional)

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `CUSTOM_DOMAIN` | Your custom domain (if any) | `myblog.com` |
| `ANTHROPIC_API_KEY` | Backup AI provider | `sk-ant-...` |
| `GEMINI_API_KEY` | Backup AI provider | `AIza...` |

---

## Step 2: Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under "Source", select: **GitHub Actions** (not branch)
3. Save

That's it! GitHub Actions will deploy automatically.

---

## Step 3: Verify Workflow Permissions

1. Go to **Settings** → **Actions** → **General**
2. Scroll to "Workflow permissions"
3. Select: **Read and write permissions**
4. Check: **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

---

## Step 4: Push Your Code

```bash
cd /c/bench/darkforest

# Make sure everything is committed
git add .
git commit -m "Add GitHub Actions deployment"

# Push to GitHub
git push origin main
```

---

## Step 5: Monitor Deployment

1. Go to **Actions** tab in your repository
2. You'll see the workflow running: "Generate and Deploy Blog Content"
3. Click on it to see real-time logs
4. Wait for it to complete (2-5 minutes)

---

## Step 6: Access Your Live Blog Network

Once deployment completes, your blog network will be live at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

For example:
```
https://yoans.github.io/darkforest/
```

---

## 🎯 Quick Command Reference

### Add a Secret via GitHub CLI (Optional)

If you have GitHub CLI installed:

```bash
# Set OpenAI key
gh secret set OPENAI_API_KEY

# Set Google Analytics
gh secret set GOOGLE_ANALYTICS_ID

# Set AdSense
gh secret set GOOGLE_ADSENSE_PUBLISHER_ID
```

---

## 🔧 Troubleshooting

### Problem: Workflow fails with "OPENAI_API_KEY not set"

**Solution**: Make sure you added the secret in GitHub:
1. Settings → Secrets → Actions → New secret
2. Name: `OPENAI_API_KEY`
3. Value: Your actual key starting with `sk-`

### Problem: Pages not showing up

**Solution**: 
1. Check Settings → Pages is set to "GitHub Actions"
2. Wait 2-3 minutes after workflow completes
3. Clear browser cache

### Problem: Workflow fails at deployment step

**Solution**:
1. Check Settings → Actions → General → Workflow permissions
2. Ensure "Read and write permissions" is selected

---

## 📊 What Happens on Each Push

The GitHub Action will:
1. ✅ Install dependencies
2. ✅ Generate content using OpenAI (1 post per blog)
3. ✅ Apply professional themes
4. ✅ Create HTML files
5. ✅ Deploy to GitHub Pages
6. ✅ Update your live site automatically

---

## 🕐 Scheduled Generation

The workflow also runs automatically:
- **Daily at 2 AM UTC** - Generates fresh content
- **On every push to main** - Redeploys with updates
- **Manual trigger** - Via Actions tab

---

## 🎨 Custom Domain (Optional)

If you want to use your own domain (e.g., `myblog.com`):

1. Add DNS records at your domain provider:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   
   Type: CNAME
   Name: www
   Value: YOUR-USERNAME.github.io
   ```

2. Add secret in GitHub:
   ```
   Name: CUSTOM_DOMAIN
   Value: myblog.com
   ```

3. In repo Settings → Pages:
   - Enter your domain in "Custom domain"
   - Wait for DNS check to pass
   - Enable "Enforce HTTPS"

---

## 💰 Monetization Setup

### Google AdSense

1. Sign up: https://adsense.google.com
2. Get approved (requires 10-20 posts with traffic)
3. Get your Publisher ID: `ca-pub-XXXXXXXXXXXXXXXX`
4. Add as GitHub secret: `GOOGLE_ADSENSE_PUBLISHER_ID`
5. Redeploy - ads will appear automatically!

### Amazon Associates

1. Join: https://affiliate-program.amazon.com
2. Get your Associate ID: `your-id-20`
3. Add as GitHub secret: `AMAZON_ASSOCIATE_ID`
4. Product recommendations will appear in posts

---

## 📈 Analytics Setup

### Google Analytics

1. Create property: https://analytics.google.com
2. Get Measurement ID: `G-XXXXXXXXXX`
3. Add as GitHub secret: `GOOGLE_ANALYTICS_ID`
4. Analytics tracking will be enabled automatically

---

## 🎯 Recommended Workflow

### Initial Setup (Today)
```bash
# 1. Add OPENAI_API_KEY to GitHub secrets
# 2. Push code
git push origin main

# 3. Wait for deployment
# 4. Visit https://YOUR-USERNAME.github.io/YOUR-REPO/
```

### Week 1
- Generate 5-10 posts per blog
- Set up Google Analytics
- Apply for AdSense (if you have traffic)

### Week 2-4
- Monitor traffic in Analytics
- Add Amazon Associates
- Enable custom domain (optional)

---

## 🚨 Important Notes

### API Costs

With `POSTS_PER_GENERATION=1` (default):
- **Daily**: 4 posts × $0.10 = $0.40/day
- **Monthly**: ~$12/month
- Adjust in workflow file if needed

### Rate Limits

OpenAI rate limits:
- GPT-4: 10,000 tokens/minute (plenty for blogs)
- If you hit limits, reduce posts or add delays

### Storage

GitHub Pages:
- **Soft limit**: 1 GB
- **Bandwidth**: 100 GB/month
- **Builds**: 10 per hour

This is more than enough for 100+ blog posts!

---

## ✅ Checklist

Before deploying, make sure you have:

- [ ] Added `OPENAI_API_KEY` to GitHub secrets
- [ ] Enabled GitHub Pages (Source: GitHub Actions)
- [ ] Set workflow permissions (Read and write)
- [ ] Committed all files
- [ ] Pushed to GitHub

---

## 🎉 You're Done!

After following these steps:
- Your blog network will be live at GitHub Pages
- New content generates daily at 2 AM UTC
- You can manually trigger generation anytime
- Everything is automated and free (except OpenAI API)

**Next Steps:**
1. Share your blog URL on social media
2. Submit to Google Search Console
3. Start building traffic
4. Enable monetization once you have visitors

---

*Last updated: October 1, 2025*
