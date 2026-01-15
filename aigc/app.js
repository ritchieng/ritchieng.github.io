// Parse YAML frontmatter from markdown
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { metadata: {}, content: content };
    }
    
    const frontmatterStr = match[1];
    const metadata = {};
    
    // Simple YAML parser for our needs
    frontmatterStr.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            let value = valueParts.join(':').trim();
            // Remove quotes if present
            value = value.replace(/^["']|["']$/g, '');
            metadata[key.trim()] = value;
        }
    });
    
    const bodyContent = content.replace(frontmatterRegex, '').trim();
    return { metadata, content: bodyContent };
}

// Fetch and parse all markdown files
async function loadPosts() {
    try {
        // Try to fetch a list of posts - we'll use a fallback approach
        const postFiles = [
            'intro-to-aigc',
            'transformer-architecture',
            'fine-tuning-techniques'
        ];
        
        const posts = [];
        
        for (const filename of postFiles) {
            try {
                const response = await fetch(`./posts/${filename}.md`);
                if (!response.ok) continue;
                
                const content = await response.text();
                const { metadata } = parseFrontmatter(content);
                
                if (metadata.title) {
                    posts.push({
                        title: metadata.title || 'Untitled',
                        date: metadata.date || 'Unknown Date',
                        excerpt: metadata.excerpt || 'No description available',
                        category: metadata.category || 'AIGC',
                        filename: filename,
                        link: `./posts/${filename}/`
                    });
                }
            } catch (err) {
                // Post file doesn't exist, skip it
            }
        }
        
        return posts;
    } catch (err) {
        console.error('Error loading posts:', err);
        return [];
    }
}

const POSTS_PER_PAGE = 5;
let currentPage = 0;
let isLoading = false;
let allPosts = [];

function formatDate(dateStr) {
    try {
        const [year, month, day] = dateStr.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
        return dateStr;
    }
}

function createPostCard(post) {
    return `
    <article class="bg-gray-900/80 p-6 rounded-lg border-l-4 border-[#00ff88] hover:border-[#00ccff] shadow-lg shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex justify-between items-start mb-3">
            <span class="text-xs text-[#00ccff] bg-[#00ccff]/10 px-3 py-1 rounded-full font-bold">${post.category}</span>
            <time class="text-sm text-gray-500 font-mono">${formatDate(post.date)}</time>
        </div>
        <h2 class="text-xl font-semibold mb-3 text-[#f1c40f] hover:text-[#00ff88] transition">
            <a href="${post.link}">${post.title}</a>
        </h2>
        <p class="text-gray-300 mb-4 pl-2 border-l-2 border-gray-700">${post.excerpt}</p>
        <div class="flex justify-between items-center">
            <a href="${post.link}" class="text-[#00ccff] inline-flex items-center hover:underline group">
                Read More <span class="ml-1 group-hover:ml-2 transition-all">→</span>
            </a>
            <span class="text-gray-500 text-xs">~/${post.link.replace('./', '')}</span>
        </div>
    </article>
    `;
}

function loadMorePosts() {
    if (isLoading) return;
    isLoading = true;

    const loadingEl = document.getElementById('loading');
    loadingEl.classList.remove('hidden');

    setTimeout(() => {
        const aigcList = document.getElementById('aigc-list');
        const start = currentPage * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE;
        const posts = allPosts.slice(start, end);

        posts.forEach(post => {
            aigcList.insertAdjacentHTML('beforeend', createPostCard(post));
        });

        loadingEl.classList.add('hidden');
        isLoading = false;
        currentPage++;

        if (end >= allPosts.length) {
            window.removeEventListener('scroll', handleScroll);
            if (allPosts.length > 0) {
                loadingEl.innerText = 'All posts loaded.';
                loadingEl.classList.remove('hidden');
            }
        }
    }, 300);
}

function handleScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        loadMorePosts();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    allPosts = await loadPosts();
    
    if (allPosts.length === 0) {
        const loadingEl = document.getElementById('loading');
        loadingEl.innerText = 'No posts found. Create markdown files in ./posts/ directory.';
        loadingEl.classList.remove('hidden');
        return;
    }
    
    loadMorePosts();
    window.addEventListener('scroll', handleScroll);
});
