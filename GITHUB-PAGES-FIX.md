# 🔧 GitHub Pages Fix Guide

## Problem: GitHub Pages showing README instead of blog network

This happens when GitHub Pages is set to deploy from the wrong source.

---

## ✅ Solution: Configure GitHub Pages Settings

### Step 1: Go to Repository Settings

1. Open your repository: https://github.com/yoans/darkforest
2. Click **Settings** tab (top right)
3. Scroll down to **Pages** (left sidebar)

### Step 2: Check "Build and deployment" Settings

You should see:

```
Source: Deploy from a branch
Branch: gh-pages / (root)
```

**If it shows `main` branch instead:**
- The workflow creates a `gh-pages` branch automatically
- After the workflow runs once, the `gh-pages` branch will appear
- Then you can select it

### Step 3: Wait for Workflow to Complete

1. Go to **Actions** tab
2. You should see "Fix GitHub Pages deployment" workflow running
3. Wait 2-5 minutes for it to complete
4. Look for green checkmark ✅

### Step 4: Verify gh-pages Branch Exists

1. Click on the branch dropdown (shows "main")
2. Look for `gh-pages` branch in the list
3. If it doesn't exist yet, the workflow is still running

### Step 5: Select gh-pages Branch

Once the workflow completes:

1. Go back to **Settings** → **Pages**
2. Under "Branch":
   - Select: `gh-pages`
   - Directory: `/ (root)`
3. Click **Save**

---

## 🔍 Troubleshooting

### If gh-pages branch doesn't appear:

**Check workflow logs:**
```
1. Go to Actions tab
2. Click on the latest workflow run
3. Expand "Deploy to gh-pages branch" step
4. Look for errors
```

**Common issues:**

#### Issue: "OPENAI_API_KEY not set"
**Solution:**
- Go to Settings → Secrets → Actions
- Add secret: `OPENAI_API_KEY` = `sk-...`

#### Issue: "Permission denied"
**Solution:**
- Settings → Actions → General
- Workflow permissions: "Read and write permissions" ✅

#### Issue: "No output directory"
**Solution:**
- This is normal on first run
- Content will be generated automatically

---

## 📊 What Fixed It

### Previous Problem:
The workflow was running `cd generators` which changed the working directory, but:
- The `output/` directory is at the root level
- The script was looking in wrong place

### Fix Applied:
Changed from:
```yaml
run: |
  cd generators
  node openai-content-pipeline.js batch 1
```

To:
```yaml
run: |
  node generators/openai-content-pipeline.js batch 1
```

This keeps the working directory at root where `output/` exists.

---

## ✨ After Fix - What Should Happen

1. **Workflow runs** (2-5 minutes)
2. **Content generated** from existing `output/` directory
3. **deploy/** directory created with all blogs
4. **gh-pages branch** created/updated
5. **GitHub Pages** deploys from gh-pages branch
6. **Your site is live!** 🎉

---

## 🌐 Your Live URLs

Once deployed:

**Main Network:**
```
https://yoans.github.io/darkforest/
```

**Individual Blogs:**
```
https://yoans.github.io/darkforest/ai-business-insights/
https://yoans.github.io/darkforest/cybersecurity-today/
https://yoans.github.io/darkforest/marketing-automation-hub/
https://yoans.github.io/darkforest/remote-work-revolution/
```

---

## ⏱️ Timeline

- **Now:** Workflow triggered by push
- **+2 min:** Content generation & deployment complete
- **+3 min:** gh-pages branch created
- **+5 min:** GitHub Pages builds and deploys
- **+7 min:** Your site is live! 🚀

---

## 🔔 How to Monitor

1. **Actions Tab:**
   - Shows workflow progress in real-time
   - Green ✅ = success
   - Red ❌ = error (click for details)

2. **Settings → Pages:**
   - Shows deployment status
   - "Your site is live at..." = success ✅

3. **Branches:**
   - Click branch dropdown
   - Look for `gh-pages` branch
   - Once it appears, Pages will deploy from it

---

## 🎯 Quick Check Commands

Run locally to verify content exists:

```bash
# Check content
find output -name "*.html" | wc -l
# Should show: 6

# Test deployment
bash scripts/test-deployment.sh
# Should show: ✅ ALL TESTS PASSED

# Check deploy directory
ls -la deploy/
# Should show: index.html, 4 blog directories, .nojekyll
```

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ Workflow shows green checkmark in Actions tab
- ✅ `gh-pages` branch exists
- ✅ Settings → Pages shows "Your site is published at..."
- ✅ Visiting the URL shows the blog network (not README)

---

## 📝 Notes

- **First deployment:** Takes 5-10 minutes total
- **Subsequent deployments:** Take 2-5 minutes
- **Content is cached:** Your existing 6 posts will deploy immediately
- **New content:** Will be generated on schedule (daily 2 AM UTC)

---

*Fix applied: October 1, 2025*  
*Workflow updated to use correct paths* ✨
