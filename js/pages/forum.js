import { getCategories, getThreads } from '../api/forum.api.js';
import { getAvatarColor } from '../components/avatar.js';
import { formatRelativeTime } from '../components/format.js';
import { escapeHtml } from '../utils.js';

const categoriesList = document.getElementById('categories-list');
const threadsPanel = document.getElementById('threads-panel');
const threadsHeading = document.getElementById('threads-heading');
const threadsList = document.getElementById('threads-list');
const createThreadLink = document.getElementById('create-thread-link');

async function loadCategories(activeCategoryId) {
    const categories = await getCategories();

    categoriesList.innerHTML = categories
        .map(category => `
            <button
                class="category-chip ${String(category.id) === String(activeCategoryId) ? 'active' : ''}"
                data-id="${category.id}"
                data-name="${escapeHtml(category.name)}"
            >${escapeHtml(category.name)}</button>
        `)
        .join('');

    categoriesList.querySelectorAll('.category-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            categoriesList.querySelectorAll('.category-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadThreads(btn.dataset.id, btn.dataset.name);
        });
    });
}

async function loadThreads(categoryId, categoryName) {
    const threads = await getThreads(categoryId);

    threadsPanel.style.display = 'block';
    threadsHeading.textContent = `Threads in ${categoryName}`;
    createThreadLink.href = `create-thread.html?categoryId=${categoryId}`;

    threadsList.innerHTML = threads.length
        ? threads.map(thread => {
            const author = thread.author || 'anonymous';
            const avatarColor = thread.author ? getAvatarColor(thread.author) : '#475569';
            const initial = thread.author ? thread.author.charAt(0).toUpperCase() : '?';

            return `
                <div class="thread-item">
                    <span class="avatar avatar-sm" style="background: ${avatarColor}">${escapeHtml(initial)}</span>
                    <div class="thread-item-body">
                        <a href="thread.html?id=${thread.id}">${escapeHtml(thread.title)}</a>
                        <div class="thread-item-meta">
                            <span class="author-name">${escapeHtml(author)}</span>
                            <span class="dot">·</span>
                            <span class="time">${formatRelativeTime(thread.created_at)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('')
        : '<p class="empty-state">No threads in this category yet. Be the first to post.</p>';
}

const preselectedCategoryId = new URLSearchParams(window.location.search).get('categoryId');

loadCategories(preselectedCategoryId).then(() => {
    if (preselectedCategoryId) {
        const activeChip = categoriesList.querySelector('.category-chip.active');
        if (activeChip) {
            loadThreads(activeChip.dataset.id, activeChip.dataset.name);
        }
    }
});
