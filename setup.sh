#!/bin/bash

# Dark Forest Network - Quick Setup Script
# This script helps you configure your environment and deploy your first blog

echo "🌲 Dark Forest Network - Quick Setup"
echo "=====================================\n"

# Check if required tools are installed
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Please install from https://nodejs.org/"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git is required. Please install Git first."
    exit 1
fi

echo "✅ Prerequisites check complete\n"

# Setup environment
echo "⚙️ Setting up environment..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file from template"
    echo "⚠️  IMPORTANT: Edit .env with your API keys before continuing!"
    echo ""
    
    # Prompt for essential API keys
    read -p "🔑 Enter your OpenAI API Key (required): " openai_key
    if [ -n "$openai_key" ]; then
        sed -i "s/sk-your-openai-key-here/$openai_key/g" .env
        echo "✅ OpenAI API key configured"
    fi
    
    read -p "🐙 Enter your GitHub username (for deployment): " github_user
    if [ -n "$github_user" ]; then
        sed -i "s/yoans/$github_user/g" .env
        echo "✅ GitHub username configured"
    fi
    
    read -p "🌐 Enter your custom domain (optional, press Enter to skip): " custom_domain
    if [ -n "$custom_domain" ]; then
        sed -i "s/darkforest.network/$custom_domain/g" .env
        echo "✅ Custom domain configured"
    fi
else
    echo "✅ Environment file already exists"
fi

# Install dependencies
echo "\n📦 Installing dependencies..."
pnpm install

# Setup database (if using local development)
echo "\n🗄️ Setting up database..."
if command -v docker &> /dev/null; then
    echo "🐳 Starting database with Docker..."
    docker-compose up -d postgres redis
    
    # Wait for database to be ready
    echo "⏳ Waiting for database to be ready..."
    sleep 10
    
    cd packages/database
    pnpm run db:push
    pnpm run db:seed
    cd ../..
    echo "✅ Database setup complete"
else
    echo "⚠️  Docker not found. You'll need to set up PostgreSQL and Redis manually."
    echo "   See SETUP.md for alternative database options (Supabase, Railway, etc.)"
fi

# Build showcase blog
echo "\n🏗️ Building showcase blog..."
cd apps/showcase-blog
pnpm install
pnpm run build
cd ../..
echo "✅ Showcase blog built"

# Setup GitHub repository
echo "\n🐙 Setting up GitHub repository..."
if [ ! -d .git ]; then
    git init
    git add .
    git commit -m "Initial Dark Forest Network setup"
    echo "✅ Git repository initialized"
    
    echo "📝 Next steps for GitHub deployment:"
    echo "   1. Create a new repository on GitHub"
    echo "   2. git remote add origin https://github.com/YOUR_USERNAME/dark-forest-network.git"
    echo "   3. git push -u origin main"
    echo "   4. Enable GitHub Pages in repository settings"
else
    echo "✅ Git repository already exists"
fi

# Display next steps
echo "\n🎉 Setup Complete!"
echo "==================\n"

echo "🚀 Quick Start Commands:"
echo "   pnpm run dev          # Start all services"
echo "   pnpm run dashboard    # Open admin dashboard (port 3000)"
echo "   pnpm run showcase     # View showcase blog (port 3100)"
echo ""

echo "📊 Monitor Your Network:"
echo "   • Dashboard:     http://localhost:3000"
echo "   • Orchestrator:  http://localhost:3001" 
echo "   • Showcase Blog: http://localhost:3100"
echo "   • N8N Workflows: http://localhost:5678 (admin/admin)"
echo ""

echo "🌐 Deployment:"
echo "   • Push to GitHub to trigger automatic deployment"
echo "   • Your showcase will be live at: https://YOUR_USERNAME.github.io/dark-forest-network/"
echo ""

echo "📖 Next Steps:"
echo "   1. Edit .env with your API keys (OpenAI, Analytics, etc.)"
echo "   2. Start the development server: pnpm run dev"
echo "   3. Create your first blog in the dashboard"
echo "   4. Watch the agents generate content automatically!"
echo ""

echo "📚 Documentation:"
echo "   • Setup Guide:     SETUP.md"
echo "   • API Keys:        API-SETUP.md"
echo "   • Architecture:    ARCHITECTURE.md"
echo "   • GitHub Pages:    GITHUB-PAGES-SETUP.md"
echo ""

echo "🆘 Need Help?"
echo "   • GitHub Issues: https://github.com/yoans/darkforest/issues"
echo "   • Documentation: https://darkforest.network/docs"
echo ""

echo "Happy blogging with AI agents! 🤖📝"