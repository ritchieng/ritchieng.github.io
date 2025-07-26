# Local CDN Libraries

This directory contains local copies of CDN dependencies to ensure your website remains functional even if external CDNs become unavailable.

## Directory Structure

```
lib/
├── tailwind/           # Tailwind CSS library
│   └── tailwind-cdn.js # Main Tailwind Play CDN build
├── d3/                 # D3.js data visualization library
│   └── d3.v7.min.js   # D3.js version 7 minified
├── mathjax/            # MathJax mathematical rendering
│   └── tex-mml-chtml.js # TeX-MML-CHTML configuration
└── README.md          # This file
```

## Libraries Included

### 1. Tailwind CSS
- **Original CDN**: `https://cdn.tailwindcss.com`
- **Local Path**: `lib/tailwind/tailwind-cdn.js`
- **Usage**: Drop-in replacement for rapid prototyping and styling
- **Size**: ~401KB

### 2. D3.js v7
- **Original CDN**: `https://d3js.org/d3.v7.min.js`
- **Local Path**: `lib/d3/d3.v7.min.js`
- **Usage**: Data visualization and DOM manipulation
- **Size**: ~273KB

### 3. MathJax
- **Original CDN**: `https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js`
- **Local Path**: `lib/mathjax/tex-mml-chtml.js`
- **Usage**: Mathematical equation rendering
- **Size**: ~1.1MB

## Maintenance

### Using the Management Script

Use the main management script for all CDN operations:

```bash
# New modular commands
./manage.sh cdn update      # Update libraries
./manage.sh cdn convert     # Convert HTML files to use local libraries
./manage.sh cdn status      # Check CDN status
./manage.sh dev start       # Start development server
./manage.sh site status     # Overall website status

# Legacy commands (still supported)
./manage.sh update          # Update libraries
./manage.sh convert         # Convert HTML files
./manage.sh test            # Start development server
./manage.sh status          # Check CDN status

# See all available commands
./manage.sh help
```

### Direct Script Access

Alternatively, run scripts directly from the `scripts/` directory:

```bash
# Update libraries
./scripts/update_cdn_libs.sh

# Convert HTML files
./scripts/convert_to_local_libs.sh

# Start local server
./scripts/test_local.sh
```

### File Structure in HTML

The conversion script automatically sets the correct relative paths:

- **Root files** (like `index.html`): `./lib/library/file.js`
- **About pages** (`/about/`): `../lib/library/file.js`  
- **Blog posts** (`/blog/*/`): `../../lib/library/file.js`

## Benefits

✅ **Offline Functionality**: Website works without internet access to CDNs  
✅ **Improved Performance**: No external DNS lookups or network latency  
✅ **Version Control**: Specific library versions are locked and tested  
✅ **CDN Resilience**: Protection against CDN outages or changes  
✅ **Privacy**: No third-party requests for basic functionality  

## Backup Files

When using the conversion script, backup files are created with `.backup` extension. You can remove them after testing:

```bash
find . -name "*.html.backup" -delete
```

Or revert changes if needed:

```bash
find . -name '*.html.backup' | while read f; do mv "$f" "${f%.backup}"; done
```

## Testing

After conversion, test your website locally to ensure all functionality works:

```bash
# Using the management script
./manage.sh dev start
# Or legacy command
./manage.sh test

# Or directly using the test script
./scripts/test_local.sh

# Or use Python's built-in server manually
python3 -m http.server 8003
```

Then visit `http://localhost:8003` to verify everything works correctly.
