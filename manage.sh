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
    echo -e "${CYAN}Site Commands:${NC}"
    echo -e "  ${GREEN}site status${NC}     Show overall website status"
    echo -e "  ${GREEN}site info${NC}       Display website information"
    echo ""
    echo -e "${CYAN}Examples:${NC}"
    echo "  $0 cdn update       # Download latest libraries"
    echo "  $0 cdn convert      # Convert HTML files to use local libraries"
    echo "  $0 dev start        # Start development server"
    echo "  $0 site status      # Show overall website status"
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

# ===========================================
# Site Management Functions
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
