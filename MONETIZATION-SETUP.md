# 💰 Monetization Setup Guide

Your Dark Forest blog network is ready to make money! Here's how to activate all revenue streams.

## 📊 Current Status

✅ **Infrastructure Ready**
- AdSense code integrated in all posts
- Amazon affiliate tracking configured
- Analytics placeholders in place
- Affiliate disclosures on every page

⚠️ **Needs Configuration**
- Real ad slot IDs
- Google Analytics ID
- Content regeneration with correct IDs

---

## Step 1: Google AdSense Setup

### Get Your Ad Slot IDs

1. Go to https://adsense.google.com
2. Navigate to **Ads** → **Overview** → **By ad unit**
3. Click **+ New ad unit** and create 4 units:

| Ad Unit Name | Type | Size | Location |
|--------------|------|------|----------|
| **DarkForest-Header** | Display ad | Responsive | Top of articles |
| **DarkForest-Sidebar** | Display ad | Responsive | Right sidebar |
| **DarkForest-InArticle** | In-article | Responsive | Middle of content |
| **DarkForest-Footer** | Display ad | Responsive | Bottom of articles |

4. For each unit, copy the **data-ad-slot** ID (10-digit number)

### Update Config

Edit `config/blog-network-config.json`:

```json
"googleAdsense": {
  "enabled": true,
  "publisherId": "ca-pub-6184158318242318",
  "adSlots": {
    "header": "1234567890",      // ← Your header ad slot
    "sidebar": "0987654321",     // ← Your sidebar ad slot
    "inArticle": "5555555555",   // ← Your in-article ad slot
    "footer": "9999999999"       // ← Your footer ad slot
  }
}
```

---

## Step 2: Google Analytics Setup

1. Go to https://analytics.google.com
2. Click **Admin** → **Create Property**
3. Property name: **Dark Forest Blog Network**
4. Website URL: `https://darkforest.sagaciasoft.com`
5. Copy your **Measurement ID** (starts with `G-`)

### Update Config

```json
"analytics": {
  "googleAnalyticsId": "G-ABC123XYZ",  // ← Your real ID here
  "enableHeatmaps": true,
  "enableSessionRecording": false
}
```

---

## Step 3: Regenerate Content

Once you've updated the config with real IDs, regenerate the content:

```bash
# Set your OpenAI API key
export OPENAI_API_KEY="sk-..."

# Regenerate all blog posts with new ads/analytics
cd generators
node openai-content-pipeline.js batch 1

# Or trigger via GitHub Actions
# Go to Actions tab → "Generate and Deploy Blog Content" → Run workflow
```

This will:
- ✅ Generate fresh content with your real ad slot IDs
- ✅ Embed Google Analytics tracking
- ✅ Include proper AdSense code
- ✅ Auto-deploy to GitHub Pages

---

## Step 4: Amazon Associates

Already configured! Your tracking ID `darkforest08-20` is active.

**To add product recommendations:**

The generator already adds affiliate product sections to articles. You can:
1. Let the AI choose products based on article topic
2. Manually update product links in `generators/ProfessionalBlogGenerator.js`

---

## Step 5: Verify Everything Works

After content regeneration:

### Check Analytics
1. Visit your site: https://darkforest.sagaciasoft.com
2. Open Google Analytics Real-Time view
3. You should see yourself as an active user

### Check AdSense
1. Visit a blog post
2. Right-click on ad space → Inspect
3. Look for `data-ad-slot` with your real ID
4. Ads may take 24-48 hours to start showing

### Check Amazon
1. Click any product link
2. URL should include `?tag=darkforest08-20`
3. Commission tracking active!

---

## 💡 Tips for Maximum Revenue

**Content Strategy**
- Generate posts on high-value topics (AI tools, business software, etc.)
- Target buyer-intent keywords
- Include 2-3 affiliate products per article

**Ad Placement**
- Header ad catches attention
- In-article ads have highest CTR
- Sidebar for returning visitors
- Footer for engaged readers

**Traffic**
- Share on social media
- Submit to Google Search Console
- Build backlinks
- Regular content generation (use the daily cron job)

---

## Quick Commands

```bash
# Check current config
cat config/blog-network-config.json | grep -A10 "monetization"

# Regenerate one post per blog
cd generators && node openai-content-pipeline.js batch 1

# Deploy immediately
git add -A && git commit -m "Update monetization IDs" && git push

# Check deployment status
# Visit: https://github.com/yoans/darkforest/actions
```

---

## Expected Revenue Timeline

| Timeframe | Milestone |
|-----------|-----------|
| **Week 1** | Analytics active, AdSense reviewing site |
| **Week 2** | First ads showing, tracking clicks |
| **Month 1** | $5-20 from initial traffic |
| **Month 3** | $50-200 with regular content |
| **Month 6** | $200-500+ with optimization |

*Actual results vary based on traffic, niche, and content quality*

---

Need help? Check the logs or run the content generator in test mode first!
