#!/bin/bash

# Blog Network Management CLI
# Centralized control for all blog operations

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

show_banner() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════╗"
    echo "║                                                    ║"
    echo "║    🤖 AI-Powered Blog Network Manager 🤖           ║"
    echo "║                                                    ║"
    echo "║    Automated Content Generation at Scale          ║"
    echo "║                                                    ║"
    echo "╚════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

show_menu() {
    echo -e "\n${YELLOW}Choose an operation:${NC}\n"
    echo "  1) 📝 Generate content (single post)"
    echo "  2) 🚀 Generate batch (multiple posts)"
    echo "  3) 👀 Preview generated content"
    echo "  4) 🌐 Deploy to GitHub Pages"
    echo "  5) ⚙️  Configure blogs"
    echo "  6) 📊 View statistics"
    echo "  7) 🧪 Test pipeline"
    echo "  8) 🛠️  Start services"
    echo "  9) 📖 Help & Documentation"
    echo "  0) 🚪 Exit"
    echo ""
}

generate_single() {
    echo -e "\n${BLUE}📝 Generate Single Post${NC}\n"
    
    # Show available blogs
    cd "$ROOT_DIR/config"
    echo -e "${YELLOW}Available blogs:${NC}"
    node -e "const config = require('./BlogNetworkConfig'); const c = new config(); c.getAllBlogs().forEach((b, i) => console.log(\`  \${i+1}) \${b.name} (\${b.id})\`));"
    
    echo -e "\n${YELLOW}Enter blog number (or press Enter for all):${NC} "
    read blog_choice
    
    cd "$ROOT_DIR/generators"
    
    if [ -z "$blog_choice" ]; then
        echo -e "\n${GREEN}Generating for all blogs...${NC}"
        node openai-content-pipeline.js batch 1
    else
        # Get blog ID
        blog_id=$(node -e "const config = require('../config/BlogNetworkConfig'); const c = new config(); console.log(c.getAllBlogs()[${blog_choice}-1]?.id || 'ai-business-insights');" 2>/dev/null || echo "ai-business-insights")
        echo -e "\n${GREEN}Generating for ${blog_id}...${NC}"
        node openai-content-pipeline.js "$blog_id"
    fi
    
    echo -e "\n${GREEN}✅ Content generated successfully!${NC}"
    read -p "Press Enter to continue..."
}

generate_batch() {
    echo -e "\n${BLUE}🚀 Generate Batch Content${NC}\n"
    
    echo -e "${YELLOW}How many posts per blog?${NC} "
    read post_count
    
    if [ -z "$post_count" ]; then
        post_count=1
    fi
    
    cd "$ROOT_DIR/generators"
    echo -e "\n${GREEN}Generating $post_count post(s) per blog...${NC}"
    node openai-content-pipeline.js batch "$post_count"
    
    echo -e "\n${GREEN}✅ Batch generation complete!${NC}"
    read -p "Press Enter to continue..."
}

preview_content() {
    echo -e "\n${BLUE}👀 Preview Generated Content${NC}\n"
    
    if [ ! -d "$ROOT_DIR/output" ]; then
        echo -e "${RED}❌ No content generated yet. Run option 1 or 2 first.${NC}"
        read -p "Press Enter to continue..."
        return
    fi
    
    echo -e "${YELLOW}Starting local server...${NC}"
    echo -e "${GREEN}Open http://localhost:8080 in your browser${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}\n"
    
    cd "$ROOT_DIR/output"
    python3 -m http.server 8080 2>/dev/null || python -m http.server 8080
}

deploy_to_pages() {
    echo -e "\n${BLUE}🌐 Deploy to GitHub Pages${NC}\n"
    
    if [ ! -d "$ROOT_DIR/output" ]; then
        echo -e "${RED}❌ No content to deploy. Generate content first.${NC}"
        read -p "Press Enter to continue..."
        return
    fi
    
    echo -e "${YELLOW}This will:${NC}"
    echo "  1. Prepare deployment directory"
    echo "  2. Create network showcase page"
    echo "  3. Copy all blog content"
    echo "  4. Configure for GitHub Pages"
    echo ""
    echo -e "${YELLOW}Continue? (y/n)${NC} "
    read confirm
    
    if [ "$confirm" != "y" ]; then
        echo -e "${YELLOW}Deployment cancelled.${NC}"
        read -p "Press Enter to continue..."
        return
    fi
    
    cd "$ROOT_DIR"
    bash scripts/deploy-to-github-pages.sh
    
    echo -e "\n${GREEN}✅ Deployment prepared!${NC}"
    echo -e "\n${YELLOW}Next steps:${NC}"
    echo "  cd deploy"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Deploy blog network'"
    echo "  git push -u origin main"
    echo ""
    read -p "Press Enter to continue..."
}

configure_blogs() {
    echo -e "\n${BLUE}⚙️  Configure Blogs${NC}\n"
    
    echo -e "${YELLOW}Choose an option:${NC}"
    echo "  1) View current configuration"
    echo "  2) Edit configuration file"
    echo "  3) Validate configuration"
    echo ""
    echo -e "${YELLOW}Enter choice:${NC} "
    read config_choice
    
    cd "$ROOT_DIR/config"
    
    case $config_choice in
        1)
            echo -e "\n${GREEN}Current Configuration:${NC}\n"
            node BlogNetworkConfig.js
            ;;
        2)
            echo -e "\n${GREEN}Opening configuration file...${NC}"
            ${EDITOR:-nano} blog-network-config.json
            ;;
        3)
            echo -e "\n${GREEN}Validating configuration...${NC}\n"
            node BlogNetworkConfig.js
            ;;
        *)
            echo -e "${RED}Invalid choice.${NC}"
            ;;
    esac
    
    read -p "Press Enter to continue..."
}

view_statistics() {
    echo -e "\n${BLUE}📊 Content Statistics${NC}\n"
    
    if [ ! -d "$ROOT_DIR/output" ]; then
        echo -e "${RED}❌ No content generated yet.${NC}"
        read -p "Press Enter to continue..."
        return
    fi
    
    cd "$ROOT_DIR/output"
    
    echo -e "${GREEN}📚 Blog Network Statistics${NC}"
    echo "══════════════════════════════════════════"
    echo ""
    
    # Count blogs
    blog_count=$(find . -maxdepth 1 -type d | tail -n +2 | wc -l)
    echo -e "Blogs: ${YELLOW}$blog_count${NC}"
    
    # Count posts
    post_count=$(find . -name "*.html" | wc -l)
    echo -e "Total Posts: ${YELLOW}$post_count${NC}"
    
    # Total size
    total_size=$(du -sh . | cut -f1)
    echo -e "Total Size: ${YELLOW}$total_size${NC}"
    
    echo ""
    echo -e "${GREEN}📝 Posts per Blog:${NC}"
    echo "──────────────────────────────────────────"
    
    for blog_dir in */; do
        if [ -d "$blog_dir" ]; then
            blog_name=$(basename "$blog_dir")
            post_count=$(find "$blog_dir" -name "*.html" | wc -l)
            echo -e "  ${blog_name}: ${YELLOW}$post_count${NC} posts"
        fi
    done
    
    echo ""
    read -p "Press Enter to continue..."
}

test_pipeline() {
    echo -e "\n${BLUE}🧪 Test Pipeline${NC}\n"
    
    cd "$ROOT_DIR/generators"
    
    echo -e "${YELLOW}Running pipeline tests...${NC}\n"
    node complete-pipeline-test.js
    
    echo -e "\n${GREEN}✅ Tests complete!${NC}"
    read -p "Press Enter to continue..."
}

start_services() {
    echo -e "\n${BLUE}🛠️  Start Services${NC}\n"
    
    echo -e "${YELLOW}Starting backend services...${NC}\n"
    
    cd "$ROOT_DIR"
    
    # Start in background
    echo "Starting Orchestrator (port 3001)..."
    (cd apps/orchestrator && pnpm dev > /dev/null 2>&1 &)
    
    echo "Starting Agents Service (port 8916)..."
    (cd apps/agents && pnpm dev > /dev/null 2>&1 &)
    
    echo "Starting Showcase Blog (port 3100)..."
    (cd apps/showcase-blog && pnpm dev > /dev/null 2>&1 &)
    
    echo ""
    echo -e "${GREEN}✅ Services started!${NC}"
    echo ""
    echo "Orchestrator: http://localhost:3001"
    echo "Agents:       http://localhost:8916"
    echo "Showcase:     http://localhost:3100"
    echo ""
    echo -e "${YELLOW}To stop services, use: pkill -f 'node.*apps'${NC}"
    echo ""
    read -p "Press Enter to continue..."
}

show_help() {
    echo -e "\n${BLUE}📖 Help & Documentation${NC}\n"
    
    echo -e "${GREEN}Getting Started:${NC}"
    echo "  1. Configure your OpenAI API key in .env"
    echo "  2. Generate test content (option 1)"
    echo "  3. Preview locally (option 3)"
    echo "  4. Deploy to GitHub Pages (option 4)"
    echo ""
    
    echo -e "${GREEN}Documentation:${NC}"
    echo "  • README-BLOG-NETWORK.md - Complete guide"
    echo "  • config/blog-network-config.json - Blog configuration"
    echo "  • .env.example - Environment variables"
    echo ""
    
    echo -e "${GREEN}Quick Commands:${NC}"
    echo "  • Generate content: node generators/openai-content-pipeline.js batch 1"
    echo "  • Test pipeline: node generators/complete-pipeline-test.js"
    echo "  • Deploy: bash scripts/deploy-to-github-pages.sh"
    echo ""
    
    echo -e "${GREEN}Support:${NC}"
    echo "  • GitHub Issues: https://github.com/YOUR-USERNAME/darkforest/issues"
    echo "  • Documentation: README-BLOG-NETWORK.md"
    echo ""
    
    read -p "Press Enter to continue..."
}

# Main loop
main() {
    while true; do
        clear
        show_banner
        show_menu
        
        read -p "Enter your choice: " choice
        
        case $choice in
            1) generate_single ;;
            2) generate_batch ;;
            3) preview_content ;;
            4) deploy_to_pages ;;
            5) configure_blogs ;;
            6) view_statistics ;;
            7) test_pipeline ;;
            8) start_services ;;
            9) show_help ;;
            0) echo -e "\n${GREEN}👋 Goodbye!${NC}\n"; exit 0 ;;
            *) echo -e "\n${RED}Invalid choice. Please try again.${NC}"; sleep 2 ;;
        esac
    done
}

# Run main
main
