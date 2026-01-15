# AIGC Blog Setup

This directory implements a markdown-based blogging system for AIGC posts, similar to the blog folder but with markdown support.

## Structure

```
aigc/
├── index.html              # Main listing page
├── app.js                  # Loads post metadata and displays cards
├── sample-post/            # Template folder for post rendering
│   ├── index.html
│   └── app.js
└── posts/
    ├── intro-to-aigc.md
    ├── intro-to-aigc/      # Post directory (auto-generated)
    │   ├── index.html
    │   └── app.js
    ├── transformer-architecture.md
    ├── transformer-architecture/
    │   ├── index.html
    │   └── app.js
    └── [more posts...]
```

## How It Works

### 1. Markdown Files
Write posts as markdown files in `aigc/posts/` with YAML frontmatter:

```markdown
---
title: "Your Post Title"
date: "2026-01-15"
category: "Category Name"
excerpt: "Brief description shown in listings"
---

# Your Post Title

Your markdown content here...
```

### 2. Post Discovery
- The listing page (`aigc/index.html`) fetches markdown files defined in `aigc/app.js`
- Currently configured files in `app.js`:
  ```javascript
  const postFiles = [
      'intro-to-aigc',
      'transformer-architecture',
      'fine-tuning-techniques'
  ];
  ```
- Add more post filenames to this array to include them

### 3. Post Rendering
- Each post gets its own directory: `aigc/posts/{post-name}/`
- Contains `index.html` and `app.js` (copied from `sample-post/` template)
- The app.js:
  - Extracts the filename from URL
  - Fetches the corresponding `.md` file
  - Parses frontmatter (title, date, category, excerpt)
  - Converts markdown to HTML using `marked.js`
  - Renders with proper styling

## How to Add a New Post

1. **Create the markdown file** in `aigc/posts/`:
   ```bash
   # Create the file with frontmatter
   cat > aigc/posts/my-post.md << 'EOF'
   ---
   title: "My Post Title"
   date: "2026-01-15"
   category: "AIGC Fundamentals"
   excerpt: "A brief excerpt for the listing page"
   ---

   # My Post Title

   Your content here...
   EOF
   ```

2. **Create the post directory**:
   ```bash
   mkdir -p aigc/posts/my-post
   ```

3. **Copy the template files**:
   ```bash
   cp aigc/sample-post/index.html aigc/posts/my-post/
   cp aigc/sample-post/app.js aigc/posts/my-post/
   ```

4. **Register the post** in `aigc/app.js`:
   ```javascript
   const postFiles = [
       'intro-to-aigc',
       'transformer-architecture',
       'fine-tuning-techniques',
       'my-post'  // Add this line
   ];
   ```

5. **Access the post**:
   - Main listing: `http://yourdomain.com/aigc/`
   - Individual post: `http://yourdomain.com/aigc/posts/my-post/`

## Supported Markdown Features

- **Headers**: `# H1`, `## H2`, etc.
- **Bold/Italic**: `**bold**`, `*italic*`
- **Lists**: Unordered and ordered lists
- **Code blocks**: With syntax highlighting
- **Inline code**: `` `code` ``
- **Links**: `[text](url)`
- **Blockquotes**: `> quote`
- **Tables**: Standard markdown tables
- **Math**: LaTeX inline (`$...$`) and display (`$$...$$`)

## Styling

The system uses:
- **Tailwind CSS** for responsive layout
- **MathJax** for mathematical equations
- **Marked.js** for markdown parsing
- **Custom bash-themed CSS** from `css/styles.css`

All styles are consistent with your existing blog theme:
- Color scheme: Dark terminal theme (#101216 background)
- Accent colors: #00ff88 (green), #00ccff (cyan), #f1c40f (yellow)
- Font: Fira Code monospace

## Performance Notes

- Markdown files are fetched client-side
- Marked.js and MathJax are deferred for better performance
- No build step required - posts render in the browser
- Each post is independent - changes don't affect others

## Adding More Posts

The example includes 3 sample posts. To add more:

1. Create the `.md` file in `aigc/posts/`
2. Create the directory and copy templates
3. Add the filename to `postFiles` array in `aigc/app.js`

That's it! The system will automatically discover and display your posts.
