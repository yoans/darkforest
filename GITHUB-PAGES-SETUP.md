# 🚀 GitHub Pages Deployment Setup

## Quick Setup (5 minutes)

### 1. Enable GitHub Pages
```bash
# Go to your repository settings
# 1. Navigate to: Settings > Pages
# 2. Source: Deploy from a branch
# 3. Branch: gh-pages / (root)
# 4. Save
```

### 2. Configure Repository Secrets
```bash
# Go to: Settings > Secrets and variables > Actions
# Add these secrets (if using private repo):

# GITHUB_TOKEN (automatically available for public repos)
# Custom domain secrets (if applicable):
# CUSTOM_DOMAIN=darkforest.sagaciasoft.com
```

### 3. Update Repository Settings
```bash
# In your repository settings:
# 1. Go to Settings > Actions > General
# 2. Workflow permissions: Read and write permissions
# 3. Allow GitHub Actions to create and approve pull requests: ✓
```

### 4. Trigger First Deployment
```bash
# Option 1: Push changes to main branch
git add .
git commit -m "Initial Dark Forest Network site"
git push origin main

# Option 2: Manual trigger
# Go to Actions tab > Deploy Dark Forest Network > Run workflow
```

## Custom Domain Setup (Optional)

### If you own a domain (e.g., darkforest.sagaciasoft.com):

```bash
# 1. Create CNAME file
echo "darkforest.sagaciasoft.com" > apps/showcase-blog/public/CNAME

# 2. Configure DNS at your registrar:
# Type: CNAME
# Host: @ (or www)
# Value: yoans.github.io

# 3. Update GitHub Pages settings:
# Settings > Pages > Custom domain: darkforest.sagaciasoft.com
```

## Automated Deployment Features

### ✅ **Automatic Deployment**
- Deploys on every push to main branch
- Only rebuilds when showcase-blog files change
- Automatic cache management

### ⚡ **Optimized Build**
- Next.js static export for GitHub Pages
- Automatic asset optimization
- SEO-friendly static site generation

### 🔍 **Deployment Monitoring**
- Real-time build status in Actions tab
- Deployment URL automatically generated
- Error notifications and logs

## File Structure for GitHub Pages

```
apps/showcase-blog/
├── public/
│   ├── CNAME              # Custom domain (if applicable)
│   ├── robots.txt         # SEO configuration
│   └── sitemap.xml        # Auto-generated sitemap
├── src/app/
│   ├── layout.tsx         # Main layout with SEO
│   ├── page.tsx           # Homepage showcase
│   └── globals.css        # Styling
└── out/                   # Generated static files (auto-created)
```

## SEO & Performance Optimizations

### Built-in Features:
- ⚡ Static site generation for fast loading
- 🔍 SEO meta tags and Open Graph
- 📱 Mobile-responsive design
- 🎨 Modern gradient animations
- 📊 Real-time stats simulation
- 🤖 Agent status displays

### Analytics Integration:
```javascript
// Add to layout.tsx for Google Analytics
{process.env.NODE_ENV === 'production' && (
  <Script
    src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
    strategy="afterInteractive"
  />
)}
```

## Live URLs

After deployment, your site will be available at:

### GitHub Pages URL:
```
https://yoans.github.io/dark-forest-network/
```

### Custom Domain (if configured):
```
https://darkforest.sagaciasoft.com/
```

## Troubleshooting

### Common Issues:

**Build Fails:**
```bash
# Check the Actions tab for detailed logs
# Common fixes:
# 1. Ensure all dependencies are in package.json
# 2. Check for TypeScript errors
# 3. Verify Next.js config for static export
```

**404 on GitHub Pages:**
```bash
# Ensure:
# 1. Repository is public (or Pages is enabled for private)
# 2. gh-pages branch exists
# 3. Index.html exists in gh-pages root
```

**Custom Domain Not Working:**
```bash
# Check:
# 1. CNAME file exists in public/ folder
# 2. DNS records are configured correctly
# 3. Allow 24-48 hours for DNS propagation
```

## Next Steps

1. ✅ **Deploy Showcase Site** - Get your main site live
2. 🤖 **Add Agent Dashboard** - Show live agent activity
3. 📊 **Connect Analytics** - Track visitor engagement
4. 🌐 **Deploy Network Sites** - Launch individual blog sites
5. 💰 **Enable Monetization** - Add revenue streams

Your Dark Forest Network showcase will demonstrate:
- 🎯 Real-time agent activity simulation
- 📈 Live statistics and metrics
- 🌐 Network of AI-managed blogs
- 💡 Technical architecture explanation
- 🚀 Call-to-action for developers

Ready to go live with your AI blog network showcase!