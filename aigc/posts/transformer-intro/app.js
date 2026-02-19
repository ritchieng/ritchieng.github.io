// Parse YAML frontmatter from markdown
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { metadata: {}, content: content };
    }
    
    const frontmatterStr = match[1];
    const metadata = {};
    
    // Simple YAML parser
    frontmatterStr.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            let value = valueParts.join(':').trim();
            value = value.replace(/^["']|["']$/g, '');
            metadata[key.trim()] = value;
        }
    });
    
    const bodyContent = content.replace(frontmatterRegex, '').trim();
    return { metadata, content: bodyContent };
}

// Get the post filename from URL
function getPostFilename() {
    const path = window.location.pathname;
    const parts = path.split('/');
    // Should be something like /aigc/posts/post-name/
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === 'posts' && i + 1 < parts.length) {
            return parts[i + 1];
        }
    }
    return null;
}

// Format date
function formatDate(dateStr) {
    try {
        const [year, month, day] = dateStr.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
        return dateStr;
    }
}

// Load and render the post
async function loadPost() {
    const filename = getPostFilename();
    if (!filename) {
        document.getElementById('post-container').innerHTML = '<p>Post not found</p>';
        return;
    }

    console.log('Loading post:', filename);

    try {
        // Fetch the markdown file from the posts directory (one level up from current post dir)
        const response = await fetch(`/aigc/posts/${filename}.md`);
        
        if (!response.ok) {
            console.error('Failed to fetch markdown:', response.status, response.statusText);
            document.getElementById('post-container').innerHTML = `<p>Could not load post (${response.status})</p>`;
            return;
        }

        const markdownContent = await response.text();
        console.log('Markdown loaded, length:', markdownContent.length);
        
        const { metadata, content } = parseFrontmatter(markdownContent);
        console.log('Metadata:', metadata);

        // Update page title
        if (metadata.title) {
            document.title = `ritchie@singapore~$ ${metadata.title}`;
        }

        // Convert markdown to HTML - ensure marked is available
        let htmlContent;
        console.log('marked available:', typeof marked !== 'undefined');
        
        if (typeof marked !== 'undefined' && marked.parse) {
            try {
                htmlContent = marked.parse(content);
                console.log('Markdown parsed successfully, HTML length:', htmlContent.length);
            } catch (e) {
                console.error('Error parsing markdown:', e);
                htmlContent = `<pre>${content}</pre>`;
            }
        } else {
            console.warn('marked.js not loaded, showing raw markdown');
            htmlContent = `<pre>${content}</pre>`;
        }

        // Build the post header
        const headerHTML = `
            <div class="post-header">
                <h1 class="post-title">${metadata.title || 'Untitled'}</h1>
                <div class="post-meta">
                    <div class="post-meta-item">
                        <span class="post-meta-label">Published:</span> ${formatDate(metadata.date || 'Unknown')}
                    </div>
                    <div class="post-meta-item">
                        <span class="post-meta-label">Category:</span> <span style="color: #00ff88;">${metadata.category || 'AIGC'}</span>
                    </div>
                </div>
            </div>
        `;

        // Insert the header and content
        const container = document.getElementById('post-container');
        container.innerHTML = headerHTML + htmlContent;

        // Re-render MathJax if it's loaded
        if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
            MathJax.typesetPromise([container]).catch(err => console.log('MathJax error:', err));
        }

    } catch (error) {
        console.error('Error loading post:', error);
        document.getElementById('post-container').innerHTML = `<p>Error loading post: ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadPost);
