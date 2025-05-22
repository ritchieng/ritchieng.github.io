const blogPosts = [
    {
        title: "Multi-vector Embeddings",
        date: "22-05-2025",
        excerpt: "An alternative to traditional embeddings for potentially better performance.",
        link: "./multi-vector-embeddings/",
        category: "AI Insights"
    },
];

const POSTS_PER_PAGE = 5;
let currentPage = 0;
let isLoading = false;

function formatDate(dateStr) {
    const [day, month, year] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function createBlogCard(post) {
    return `
    <article class="bg-gray-800/40 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition duration-300">
        <span class="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full inline-block mb-3">${post.category}</span>
        <time class="block text-sm text-gray-500 mb-2">${formatDate(post.date)}</time>
        <h2 class="text-xl font-semibold mb-2 hover:text-blue-400 transition">
            <a href="${post.link}">${post.title}</a>
        </h2>
        <p class="text-gray-400 mb-4">${post.excerpt}</p>
        <a href="${post.link}" class="text-blue-400 inline-flex items-center hover:underline">Read More →
        </a>
    </article>
    `;
}

function loadMorePosts() {
    if (isLoading) return;
    isLoading = true;

    const loadingEl = document.getElementById('loading');
    loadingEl.classList.remove('hidden');

    setTimeout(() => {
        const blogList = document.getElementById('blog-list');
        const start = currentPage * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE;
        const posts = blogPosts.slice(start, end);

        posts.forEach(post => {
            blogList.insertAdjacentHTML('beforeend', createBlogCard(post));
        });

        loadingEl.classList.add('hidden');
        isLoading = false;
        currentPage++;

        if (end >= blogPosts.length) {
            window.removeEventListener('scroll', handleScroll);
            loadingEl.innerText = 'All posts loaded.';
            loadingEl.classList.remove('hidden');
        }
    }, 500);
}

function handleScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        loadMorePosts();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadMorePosts();
    window.addEventListener('scroll', handleScroll);
});
