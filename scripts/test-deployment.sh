#!/bin/bash

# Test deployment locally before pushing to GitHub

echo "🧪 Testing Deployment Process"
echo "=============================="
echo ""

# Step 1: Check if content exists
echo "1️⃣  Checking for generated content..."
if [ ! -d "./output" ] || [ -z "$(ls -A ./output 2>/dev/null)" ]; then
    echo "❌ No content found in ./output/"
    echo ""
    echo "Generate content first with:"
    echo "  cd generators"
    echo "  node openai-content-pipeline.js batch 1"
    exit 1
fi

post_count=$(find ./output -name "*.html" 2>/dev/null | wc -l)
echo "✅ Found $post_count HTML files"
echo ""

# Step 2: Test deployment script
echo "2️⃣  Running deployment script..."
bash scripts/deploy-production.sh

if [ $? -ne 0 ]; then
    echo "❌ Deployment script failed"
    exit 1
fi

echo ""
echo "✅ Deployment script succeeded"
echo ""

# Step 3: Verify deploy directory
echo "3️⃣  Verifying deploy directory..."
if [ ! -d "./deploy" ]; then
    echo "❌ Deploy directory not created"
    exit 1
fi

deploy_files=$(find ./deploy -name "*.html" 2>/dev/null | wc -l)
echo "✅ Found $deploy_files HTML files in deploy/"

if [ -f "./deploy/index.html" ]; then
    echo "✅ Main index.html exists"
else
    echo "❌ Main index.html missing"
    exit 1
fi

if [ -f "./deploy/.nojekyll" ]; then
    echo "✅ .nojekyll file exists"
else
    echo "❌ .nojekyll file missing"
    exit 1
fi

echo ""

# Step 4: Check file sizes
echo "4️⃣  Checking deployment size..."
deploy_size=$(du -sh ./deploy 2>/dev/null | cut -f1)
echo "   Total size: $deploy_size"

# Step 5: Preview
echo ""
echo "5️⃣  Preview available at:"
echo "   cd deploy && python -m http.server 8000"
echo "   Then open: http://localhost:8000"
echo ""

# Success summary
echo "=============================="
echo "✅ All tests passed!"
echo "=============================="
echo ""
echo "📊 Summary:"
echo "   - Generated posts: $post_count"
echo "   - Deployed files: $deploy_files"
echo "   - Total size: $deploy_size"
echo ""
echo "🚀 Ready to deploy to GitHub!"
echo ""
echo "Next steps:"
echo "  1. git add ."
echo "  2. git commit -m 'Ready for deployment'"
echo "  3. git push origin main"
echo "  4. Watch GitHub Actions deploy automatically"
echo ""
