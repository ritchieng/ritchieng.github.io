#!/bin/bash

# Website Management Script
# Provides easy access to website management functions including CDN, development, and maintenance
# Modular design allows easy extension for future functionality

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

show_help() {
    echo -e "${BLUE}🚀 Website Management Tool${NC}"
    echo ""
    echo "Usage: $0 [category] [command]"
    echo ""
    echo -e "${CYAN}Categories:${NC}"
    echo -e "  ${GREEN}cdn${NC}         CDN library management"
    echo -e "  ${GREEN}dev${NC}         Development tools"
    echo -e "  ${GREEN}perf${NC}        Performance testing"
    echo -e "  ${GREEN}site${NC}        Website maintenance"
    echo ""
    echo -e "${CYAN}CDN Commands:${NC}"
    echo -e "  ${GREEN}cdn update${NC}      Download/update CDN libraries to local files"
    echo -e "  ${GREEN}cdn convert${NC}     Convert HTML files from CDN to local library references"
    echo -e "  ${GREEN}cdn status${NC}      Show current library status and sizes"
    echo -e "  ${GREEN}cdn clean${NC}       Remove backup files created during conversion"
    echo -e "  ${GREEN}cdn revert${NC}      Restore HTML files from backup (undo conversion)"
    echo ""
    echo -e "${CYAN}Development Commands:${NC}"
    echo -e "  ${GREEN}dev start${NC}       Start local development server"
    echo -e "  ${GREEN}dev stop${NC}        Stop development server (if running in background)"
    echo ""
    echo -e "${CYAN}Performance Commands:${NC}"
    echo -e "  ${GREEN}perf test${NC}       Run comprehensive performance tests"
    echo -e "  ${GREEN}perf setup${NC}      Install performance testing dependencies"
    echo -e "  ${GREEN}perf quick${NC}      Quick performance check using curl"
    echo ""
    echo -e "${CYAN}Site Commands:${NC}"
    echo -e "  ${GREEN}site status${NC}     Show overall website status"
    echo -e "  ${GREEN}site info${NC}       Display website information"
    echo ""
    echo -e "${CYAN}AIGC Blog Commands:${NC}"
    echo -e "  ${GREEN}aigc new${NC} <name>      Create a new blog post with template"
    echo -e "  ${GREEN}aigc list${NC}           List all existing posts"
    echo -e "  ${GREEN}aigc edit${NC} <name>    Edit post markdown file"
    echo -e "  ${GREEN}aigc register${NC} <name> Register post in app.js"
    echo -e "  ${GREEN}aigc remove${NC} <name>  Remove a post"
    echo ""
    echo -e "${CYAN}Examples:${NC}"
    echo "  $0 cdn update           # Download latest libraries"
    echo "  $0 dev start            # Start development server"
    echo "  $0 aigc new my-post     # Create new AIGC post"
    echo "  $0 aigc list            # List all AIGC posts"
    echo "  $0 site status          # Show overall website status"
    echo ""
    echo -e "${YELLOW}Legacy support: Single commands still work (e.g., '$0 update')${NC}"
}

# ===========================================
# CDN Management Functions
# ===========================================

cdn_status() {
    echo -e "${BLUE}📊 CDN Library Status${NC}"
    echo ""
    
    if [ -d "lib" ]; then
        echo "📂 Library directory exists"
        echo ""
        echo "Library sizes:"
        ls -lah lib/*/ 2>/dev/null || echo "No libraries found"
        echo ""
        
        # Check for backup files
        backup_count=$(find . -name "*.html.backup" 2>/dev/null | wc -l | tr -d ' ')
        if [ "$backup_count" -gt 0 ]; then
            echo -e "${YELLOW}⚠️  Found $backup_count HTML backup files${NC}"
        else
            echo -e "${GREEN}✅ No backup files found${NC}"
        fi
        
        # Check for CDN references in HTML files (script/link tags only, not href links)
        cdn_refs=$(grep -r "src=\"https://cdn\|src=\"https://d3js\|src=\"https://.*jsdelivr" . --include="*.html" 2>/dev/null | grep -v ".backup" | wc -l | tr -d ' ')
        if [ "$cdn_refs" -gt 0 ]; then
            echo -e "${YELLOW}⚠️  Found $cdn_refs CDN script/stylesheet references in HTML files${NC}"
            echo "    Run './manage.sh cdn convert' to fix these"
        else
            echo -e "${GREEN}✅ All HTML files use local libraries${NC}"
        fi
    else
        echo -e "${RED}❌ Library directory not found${NC}"
    fi
}

cdn_update() {
    echo -e "${BLUE}🔄 Updating CDN libraries...${NC}"
    ./scripts/update_cdn_libs.sh
}

cdn_convert() {
    echo -e "${BLUE}🔄 Converting HTML files...${NC}"
    ./scripts/convert_to_local_libs.sh
}

cdn_clean() {
    echo -e "${BLUE}🧹 Cleaning backup files...${NC}"
    backup_count=$(find . -name "*.html.backup" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$backup_count" -gt 0 ]; then
        echo "Found $backup_count backup files"
        read -p "Delete all backup files? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            find . -name "*.html.backup" -delete
            echo -e "${GREEN}✅ Backup files deleted${NC}"
        else
            echo "Operation cancelled"
        fi
    else
        echo -e "${GREEN}✅ No backup files found${NC}"
    fi
}

cdn_revert() {
    echo -e "${BLUE}↩️  Reverting HTML files...${NC}"
    backup_count=$(find . -name "*.html.backup" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$backup_count" -gt 0 ]; then
        echo "Found $backup_count backup files"
        read -p "Restore all HTML files from backup? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            find . -name '*.html.backup' | while read f; do mv "$f" "${f%.backup}"; done
            echo -e "${GREEN}✅ HTML files restored from backup${NC}"
        else
            echo "Operation cancelled"
        fi
    else
        echo -e "${RED}❌ No backup files found${NC}"
    fi
}

# ===========================================
# Performance Functions
# ===========================================

perf_setup() {
    echo -e "${BLUE}🔧 Setting up performance testing dependencies...${NC}"
    if ! npm list puppeteer >/dev/null 2>&1; then
        npm install puppeteer --no-save && echo -e "${GREEN}✅ Puppeteer installed successfully${NC}"
    else
        echo -e "${GREEN}✅ Puppeteer is already installed${NC}"
    fi
}

perf_test() {
    echo -e "${BLUE}🚀 Running comprehensive performance tests...${NC}"
    
    # Check if puppeteer is installed first
    if ! npm list puppeteer >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Puppeteer not found. Installing dependencies...${NC}"
        perf_setup
    fi
    
    # Check if server is already running on port 8080
    if ! curl -s http://localhost:8080 >/dev/null 2>&1; then
        echo -e "${YELLOW}📡 Starting local server on port 8080...${NC}"
        python3 -m http.server 8080 --directory . >/dev/null 2>&1 &
        SERVER_PID=$!
        sleep 2  # Give server time to start
        
        # Ensure server started successfully
        if ! curl -s http://localhost:8080 >/dev/null 2>&1; then
            echo -e "${RED}❌ Failed to start local server${NC}"
            return 1
        fi
        echo -e "${GREEN}✅ Local server started (PID: $SERVER_PID)${NC}"
        STARTED_SERVER=true
    else
        echo -e "${GREEN}✅ Local server already running${NC}"
        STARTED_SERVER=false
    fi
    
    # Run the performance tests
    node scripts/performance.js
    
    # Stop the server if we started it
    if [ "$STARTED_SERVER" = true ]; then
        echo -e "${BLUE}🛑 Stopping local server...${NC}"
        kill $SERVER_PID 2>/dev/null
        echo -e "${GREEN}✅ Server stopped${NC}"
    fi
}

perf_quick() {
    echo -e "${BLUE}⚡ Quick performance check using curl...${NC}"
    
    # Check if server is already running on port 8080
    if ! curl -s http://localhost:8080 >/dev/null 2>&1; then
        echo -e "${YELLOW}📡 Starting local server on port 8080...${NC}"
        python3 -m http.server 8080 --directory . >/dev/null 2>&1 &
        SERVER_PID=$!
        sleep 2  # Give server time to start
        
        # Ensure server started successfully
        if ! curl -s http://localhost:8080 >/dev/null 2>&1; then
            echo -e "${RED}❌ Failed to start local server${NC}"
            return 1
        fi
        echo -e "${GREEN}✅ Local server started (PID: $SERVER_PID)${NC}"
        STARTED_SERVER=true
    else
        echo -e "${GREEN}✅ Local server already running${NC}"
        STARTED_SERVER=false
    fi
    
    echo "--- Home Page ---"
    curl -o /dev/null -s -w "Home Load Time: %{time_total}s\n" http://localhost:8080/
    echo "--- About Page ---"
    curl -o /dev/null -s -w "About Load Time: %{time_total}s\n" http://localhost:8080/about/
    echo "--- Blog Index ---"
    curl -o /dev/null -s -w "Blog Load Time: %{time_total}s\n" http://localhost:8080/blog/
    echo "--- Building Agents (Heavy) ---"
    curl -o /dev/null -s -w "Building Agents Load Time: %{time_total}s\n" http://localhost:8080/blog/building-agents/
    
    # Stop the server if we started it
    if [ "$STARTED_SERVER" = true ]; then
        echo -e "${BLUE}🛑 Stopping local server...${NC}"
        kill $SERVER_PID 2>/dev/null
        echo -e "${GREEN}✅ Server stopped${NC}"
    fi
}


# ===========================================
# Development Functions
# ===========================================

dev_start() {
    echo -e "${BLUE}🚀 Starting development server...${NC}"
    ./scripts/test_local.sh
}

dev_stop() {
    echo -e "${BLUE}🛑 Stopping development server...${NC}"
    # Kill any running Python HTTP servers on port 8003
    pkill -f "python.*http.server.*8003" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Development server stopped${NC}"
    else
        echo -e "${YELLOW}ℹ️  No development server running on port 8003${NC}"
    fi
}

# ===========================================# AIGC Blog Management Functions
# ===========================================

validate_post_name() {
    if [[ ! "$1" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$ ]]; then
        echo -e "${RED}❌ Invalid post name: '$1'${NC}"
        echo -e "${YELLOW}Post names must start with lowercase letter/number, contain only lowercase letters, numbers, and hyphens${NC}"
        return 1
    fi
    return 0
}

aigc_new() {
    local post_name="$1"
    
    validate_post_name "$post_name" || return 1
    
    if [ -d "aigc/posts/$post_name" ]; then
        echo -e "${RED}❌ Post '$post_name' already exists${NC}"
        return 1
    fi
    
    local title=$(echo "$post_name" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')
    local date=$(date +%Y-%m-%d)
    
    cat > "aigc/posts/$post_name.md" << EOF
---
title: "$title"
date: "$date"
category: "AIGC"
excerpt: "Brief description of your post that appears in the listing page"
---

# $title

Write your introduction here...

## Main Section

Your content goes here. You can use:

- **Bold text** with \`**bold**\`
- *Italic text* with \`*italic*\`
- \`inline code\` with backticks
- Links with \`[text](url)\`

### Code Example

\`\`\`python
def hello():
    print("Hello, AIGC!")
\`\`\`

### Math Equations

Inline math: \$E = mc^2\$

Display math:
\$\$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
\$\$

## Conclusion

Wrap up your post here.
EOF

    mkdir -p "aigc/posts/$post_name"
    cp "aigc/sample-post/index.html" "aigc/posts/$post_name/"
    cp "aigc/sample-post/app.js" "aigc/posts/$post_name/"
    
    # Automatically update app.js files with the new post
    aigc_sync_app_js
    
    echo -e "${GREEN}✅ Post created: $post_name${NC}"
    echo ""
    echo -e "${CYAN}Files created:${NC}"
    echo "  • aigc/posts/$post_name.md (markdown file)"
    echo "  • aigc/posts/$post_name/index.html"
    echo "  • aigc/posts/$post_name/app.js"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Edit the post: $0 aigc edit $post_name"
    echo "  2. Access at: /aigc/posts/$post_name/"
}

aigc_list() {
    echo -e "${BLUE}📚 AIGC Blog Posts${NC}"
    echo ""
    
    if [ ! -d "aigc/posts" ]; then
        echo -e "${YELLOW}No posts directory found${NC}"
        return
    fi
    
    local post_count=$(find "aigc/posts" -maxdepth 1 -name "*.md" -type f | wc -l | tr -d ' ')
    
    if [ "$post_count" -eq 0 ]; then
        echo -e "${YELLOW}No posts found${NC}"
        return
    fi
    
    echo -e "${CYAN}Markdown Files (posts):${NC}"
    echo ""
    
    find "aigc/posts" -maxdepth 1 -name "*.md" -type f | sort | while read md_file; do
        local basename=$(basename "$md_file" .md)
        local title=$(grep '^title:' "$md_file" | head -1 | sed 's/^title: //g' | tr -d '"')
        local date=$(grep '^date:' "$md_file" | head -1 | sed 's/^date: //g' | tr -d '"')
        
        if grep -q "'$basename'" "aigc/app.js"; then
            echo -e "  ${GREEN}✓${NC} $basename"
        else
            echo -e "  ${YELLOW}⚠${NC} $basename (not registered)"
        fi
        
        if [ ! -z "$title" ]; then
            echo -e "    Title: $title"
        fi
        if [ ! -z "$date" ]; then
            echo -e "    Date: $date"
        fi
        echo ""
    done
}

aigc_edit() {
    local post_name="$1"
    
    validate_post_name "$post_name" || return 1
    
    if [ ! -f "aigc/posts/$post_name.md" ]; then
        echo -e "${RED}❌ Post '$post_name' not found${NC}"
        return 1
    fi
    
    ${EDITOR:-nano} "aigc/posts/$post_name.md"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Post saved${NC}"
    fi
}

aigc_sync_app_js() {
    # Find all existing markdown posts
    local posts=()
    if [ -d "aigc/posts" ]; then
        while IFS= read -r md_file; do
            local filename=$(basename "$md_file" .md)
            posts+=("$filename")
        done < <(find "aigc/posts" -maxdepth 1 -name "*.md" -type f | sort)
    fi
    
    # If no posts found, keep intro-to-aigc as default
    if [ ${#posts[@]} -eq 0 ]; then
        posts=("intro-to-aigc")
    fi
    
    # Generate postFiles array content
    local post_array="const postFiles = ["
    for i in "${!posts[@]}"; do
        post_array+=$'\n            '"'${posts[$i]}'"
        if [ $i -lt $((${#posts[@]} - 1)) ]; then
            post_array+=","
        fi
    done
    post_array+=$'\n        ];'
    
    # Update aigc/app.js
    if [ -f "aigc/app.js" ]; then
        # Use a temporary file for complex replacement
        sed "/const postFiles = \[/,/\];/c\\
$post_array" "aigc/app.js" > "aigc/app.js.tmp" && mv "aigc/app.js.tmp" "aigc/app.js"
    fi
    
    # Update app.js in all post directories
    find "aigc/posts" -maxdepth 1 -type d | while read post_dir; do
        if [ -f "$post_dir/app.js" ] && [ "$post_dir" != "aigc/posts" ]; then
            sed "/const postFiles = \[/,/\];/c\\
$post_array" "$post_dir/app.js" > "$post_dir/app.js.tmp" && mv "$post_dir/app.js.tmp" "$post_dir/app.js"
        fi
    done
}

aigc_register() {
    local post_name="$1"
    
    validate_post_name "$post_name" || return 1
    
    if [ ! -f "aigc/posts/$post_name.md" ]; then
        echo -e "${RED}❌ Post markdown file not found: aigc/posts/$post_name.md${NC}"
        return 1
    fi
    
    if grep -q "'$post_name'" "aigc/app.js"; then
        echo -e "${YELLOW}⚠️  Post already registered${NC}"
        return 0
    fi
    
    if grep -q "const postFiles = \[" "aigc/app.js"; then
        sed -i.bak "/const postFiles = \[/,/\];/s/\];/    '$post_name',\n];/" "aigc/app.js"
        rm -f "aigc/app.js.bak"
        echo -e "${GREEN}✅ Post registered: $post_name${NC}"
    else
        echo -e "${RED}❌ Could not find postFiles array in aigc/app.js${NC}"
        return 1
    fi
}

aigc_remove() {
    local post_name="$1"
    
    validate_post_name "$post_name" || return 1
    
    if [ ! -d "aigc/posts/$post_name" ] && [ ! -f "aigc/posts/$post_name.md" ]; then
        echo -e "${RED}❌ Post '$post_name' not found${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}⚠️  This will remove:${NC}"
    [ -f "aigc/posts/$post_name.md" ] && echo "  • aigc/posts/$post_name.md"
    [ -d "aigc/posts/$post_name" ] && echo "  • aigc/posts/$post_name/ (directory and files)"
    
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -f "aigc/posts/$post_name.md"
        rm -rf "aigc/posts/$post_name"
        
        # Automatically update app.js files to reflect removal
        aigc_sync_app_js
        
        echo -e "${GREEN}✅ Post removed: $post_name${NC}"
    else
        echo "Operation cancelled"
    fi
}

# ===========================================# Site Management Functions
# ===========================================

site_status() {
    echo -e "${BLUE}🌐 Website Status Overview${NC}"
    echo ""
    
    # Basic file count
    html_count=$(find . -name "*.html" | grep -v ".backup" | wc -l | tr -d ' ')
    css_count=$(find . -name "*.css" | wc -l | tr -d ' ')
    js_count=$(find . -name "*.js" | wc -l | tr -d ' ')
    
    echo -e "${GREEN}📄 Content:${NC}"
    echo "  HTML files: $html_count"
    echo "  CSS files: $css_count" 
    echo "  JavaScript files: $js_count"
    echo ""
    
    # CDN status summary
    echo -e "${GREEN}📦 CDN Libraries:${NC}"
    if [ -d "lib" ]; then
        lib_count=$(find lib -name "*.js" | wc -l | tr -d ' ')
        lib_size=$(du -sh lib 2>/dev/null | cut -f1)
        echo "  Local libraries: $lib_count files ($lib_size)"
        
        cdn_refs=$(grep -r "src=\"https://cdn\|src=\"https://d3js\|src=\"https://.*jsdelivr" . --include="*.html" 2>/dev/null | grep -v ".backup" | wc -l | tr -d ' ')
        if [ "$cdn_refs" -eq 0 ]; then
            echo -e "  Status: ${GREEN}✅ Fully local${NC}"
        else
            echo -e "  Status: ${YELLOW}⚠️  $cdn_refs CDN dependencies remaining${NC}"
        fi
    else
        echo -e "  Status: ${RED}❌ No local libraries${NC}"
    fi
    echo ""
    
    # Git status if available
    if [ -d ".git" ]; then
        echo -e "${GREEN}📝 Git Status:${NC}"
        git_status=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
        if [ "$git_status" -eq 0 ]; then
            echo -e "  Working directory: ${GREEN}✅ Clean${NC}"
        else
            echo -e "  Working directory: ${YELLOW}⚠️  $git_status uncommitted changes${NC}"
        fi
    fi
}

site_info() {
    echo -e "${BLUE}ℹ️  Website Information${NC}"
    echo ""
    
    if [ -f "README.md" ]; then
        echo -e "${GREEN}📖 Project:${NC}"
        head -3 README.md 2>/dev/null | sed 's/^/  /'
        echo ""
    fi
    
    echo -e "${GREEN}📁 Directory Structure:${NC}"
    tree -L 2 -a -I '.git|*.backup|node_modules' 2>/dev/null || find . -maxdepth 2 -type d | head -10
    echo ""
    
    echo -e "${GREEN}🔧 Available Scripts:${NC}"
    if [ -d "scripts" ]; then
        ls scripts/*.sh 2>/dev/null | sed 's/scripts\//  /' | sed 's/\.sh//'
    fi
}

# ===========================================
# Main Command Routing
# ===========================================

# Handle legacy single commands for backward compatibility
handle_legacy_command() {
    case "$1" in
        "update") cdn_update ;;
        "convert") cdn_convert ;;
        "test") dev_start ;;
        "clean") cdn_clean ;;
        "revert") cdn_revert ;;
        "status") cdn_status ;;
        *) return 1 ;;
    esac
    return 0
}

# Main command handling
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

# Try legacy command first
if handle_legacy_command "$1"; then
    exit 0
fi

# Handle new category-based commands
case "$1" in
    "cdn")
        case "$2" in
            "update") cdn_update ;;
            "convert") cdn_convert ;;
            "status") cdn_status ;;
            "clean") cdn_clean ;;
            "revert") cdn_revert ;;
            *) 
                echo -e "${RED}❌ Unknown CDN command: $2${NC}"
                echo ""
                show_help
                exit 1
                ;;
        esac
        ;;
    "dev")
        case "$2" in
            "start") dev_start ;;
            "stop") dev_stop ;;
            *) 
                echo -e "${RED}❌ Unknown dev command: $2${NC}"
                echo ""
                show_help
                exit 1
                ;;
        esac
        ;;
    "perf")
        case "$2" in
            "setup") perf_setup ;;
            "test") perf_test ;;
            "quick") perf_quick ;;
            *) 
                echo -e "${RED}❌ Unknown performance command: $2${NC}"
                echo ""
                show_help
                exit 1
                ;;
        esac
        ;;
    "site")
        case "$2" in
            "status") site_status ;;
            "info") site_info ;;
            *) 
                echo -e "${RED}❌ Unknown site command: $2${NC}"
                echo ""
                show_help
                exit 1
                ;;
        esac
        ;;
    "aigc")
        case "$2" in
            "new") aigc_new "$3" ;;
            "list") aigc_list ;;
            "edit") aigc_edit "$3" ;;
            "register") aigc_register "$3" ;;
            "remove") aigc_remove "$3" ;;
            *) 
                echo -e "${RED}❌ Unknown AIGC command: $2${NC}"
                echo ""
                show_help
                exit 1
                ;;
        esac
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
