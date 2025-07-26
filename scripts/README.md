# Scripts Directory

This directory contains maintenance scripts for managing CDN dependencies and local development.

## Scripts Overview

### `update_cdn_libs.sh`
Downloads the latest versions of CDN libraries to the local `lib/` folder.

**Usage:**
```bash
./scripts/update_cdn_libs.sh
```

**What it does:**
- Creates necessary directories in `lib/`
- Downloads Tailwind CSS from Play CDN
- Downloads D3.js v7 minified
- Downloads MathJax TeX-MML-CHTML build
- Shows file sizes after download

### `convert_to_local_libs.sh`
Converts all HTML files from CDN references to local library paths.

**Usage:**
```bash
./scripts/convert_to_local_libs.sh
```

**What it does:**
- Finds all `.html` files in the project
- Creates `.backup` files before modification
- Replaces CDN URLs with appropriate relative paths
- Handles different directory depths automatically

### `test_local.sh`
Starts a local HTTP server for development and testing.

**Usage:**
```bash
./scripts/test_local.sh
```

**What it does:**
- Changes to project root directory
- Starts Python HTTP server on port 8003
- Provides access at `http://localhost:8003`

## Path Handling

All scripts automatically detect their location and work correctly whether run from:
- Project root: `./scripts/script_name.sh`
- Scripts directory: `cd scripts && ./script_name.sh` 
- Any other location (using absolute paths)

The scripts use these variables for path resolution:
- `SCRIPT_DIR`: Directory containing the script
- `PROJECT_ROOT`: Website root directory (parent of scripts/)

## Integration with Main Script

These scripts are designed to work with the main `manage.sh` script in the project root, which provides a convenient interface for all operations:

```bash
# New modular commands
./manage.sh cdn update      # Instead of ./scripts/update_cdn_libs.sh
./manage.sh cdn convert     # Instead of ./scripts/convert_to_local_libs.sh
./manage.sh dev start       # Instead of ./scripts/test_local.sh

# Legacy commands (still supported)
./manage.sh update          # Instead of ./scripts/update_cdn_libs.sh
./manage.sh convert         # Instead of ./scripts/convert_to_local_libs.sh
./manage.sh test            # Instead of ./scripts/test_local.sh
```
