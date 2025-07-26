#!/bin/bash

# Convert CDN references to local libraries
# This script updates all HTML files to use local library files instead of CDN
# Run from project root or scripts directory

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root to ensure correct paths
cd "$PROJECT_ROOT"

echo "🔄 Converting HTML files to use local libraries..."
echo "📂 Working directory: $(pwd)"

# Function to get relative path from HTML file to lib directory
get_relative_path() {
    local html_file="$1"
    
    if [[ "$html_file" == *"/blog/"* ]]; then
        echo "../../lib"
    elif [[ "$html_file" == *"/about/"* ]]; then
        echo "../lib"
    else
        echo "./lib"
    fi
}

# Find all HTML files in project
find . -name "*.html" -type f | while read -r html_file; do
    echo "📝 Processing: $html_file"
    
    # Get the appropriate relative path for this file
    lib_path=$(get_relative_path "$html_file")
    
    # Create backup
    cp "$html_file" "$html_file.backup"
    
    # Replace CDN URLs with local paths
    sed -i '' \
        -e "s|https://cdn\\.tailwindcss\\.com|$lib_path/tailwind/tailwind-cdn.js|g" \
        -e "s|https://d3js\\.org/d3\\.v7\\.min\\.js|$lib_path/d3/d3.v7.min.js|g" \
        -e "s|https://cdn\\.jsdelivr\\.net/npm/mathjax@3/es5/tex-mml-chtml\\.js|$lib_path/mathjax/tex-mml-chtml.js|g" \
        -e "s|https://cdn\\.jsdelivr\\.net/npm/mathjax@3/es5/tex-mtml-chtml\\.js|$lib_path/mathjax/tex-mml-chtml.js|g" \
        "$html_file"
    
    echo "✅ Updated: $html_file"
done

echo ""
echo "🎉 Conversion complete!"
echo "📂 Backup files created with .backup extension"
echo "💡 Test your website and remove .backup files if everything works correctly"
echo ""
echo "To revert changes, run:"
echo "find . -name '*.html.backup' | while read f; do mv \"\$f\" \"\${f%.backup}\"; done"
