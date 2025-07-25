const blogPosts = [
    {
        title: "Automated Reasoning with Large Language Models",
        date: "08-08-2025",
        excerpt: "Exploring how LLMs can be used for automated reasoning tasks, including SAT solving and logical inference.",
        link: "./automated-reasoning/",
        category: "AI Guardrails"
    },
    {
        title: "Building Agents",
        date: "08-07-2025",
        excerpt: "Architect of building agents that can reason, plan, and act in complex environments.",
        link: "./building-agents/",
        category: "Agentic AI"
    },
    {
        title: "Matrices represented as Graphs",
        date: "08-06-2025",
        excerpt: "Relationship between matrices and graphs",
        link: "./matrix-graph/",
        category: "Linear Algebra"
    },
    {
        title: "RENT: Reinforcement Learning via Entropy Minimization",
        date: "08-05-2025",
        excerpt: "A completely unsupervised RL approach that boosts reasoning by treating the model’s own confidence as the reward signal.",
        link: "./rent/",
        category: "Reinforcement Learning"
    }
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
