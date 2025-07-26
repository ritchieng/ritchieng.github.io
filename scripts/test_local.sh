#!/bin/bash

# Local Development Server Script
# Starts a local HTTP server for testing the website
# Run from project root or scripts directory

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root to serve files from the correct location
cd "$PROJECT_ROOT"

echo "🚀 Starting local development server..."
echo "📂 Serving files from: $(pwd)"
echo "🌐 URL: http://localhost:8003"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# For Python 3.x
python3 -m http.server 8003
