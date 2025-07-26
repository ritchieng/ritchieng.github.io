#!/bin/bash

# Update CDN Libraries Script
# This script downloads the latest versions of CDN dependencies to local lib folder

echo "🔄 Updating local CDN libraries..."

# Create directories if they don't exist
mkdir -p lib/{tailwind,d3,mathjax}

# Download Tailwind CSS (Play CDN version)
echo "📦 Downloading Tailwind CSS..."
if curl -L -H "User-Agent: Mozilla/5.0" -o lib/tailwind/tailwind-cdn.js "https://cdn.tailwindcss.com/3.4.4"; then
    echo "✅ Tailwind CSS updated successfully"
else
    echo "❌ Failed to download Tailwind CSS"
fi

# Download D3.js
echo "📦 Downloading D3.js v7..."
if curl -o lib/d3/d3.v7.min.js https://d3js.org/d3.v7.min.js; then
    echo "✅ D3.js updated successfully"
else
    echo "❌ Failed to download D3.js"
fi

# Download MathJax
echo "📦 Downloading MathJax..."
if curl -o lib/mathjax/tex-mml-chtml.js https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js; then
    echo "✅ MathJax updated successfully"
else
    echo "❌ Failed to download MathJax"
fi

# Show file sizes
echo ""
echo "📊 Library file sizes:"
ls -lah lib/*/

echo ""
echo "🎉 CDN library update complete!"
echo "💡 Remember to test your website after updating libraries"
