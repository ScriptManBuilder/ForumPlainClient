import { getCategories, getRecentThreads } from '../api/forum.api.js';
import { getRecentUsers } from '../api/users.api.js';
import { getStats } from '../api/stats.api.js';
import { getAvatarColor } from '../components/avatar.js';
import { formatDate, formatRelativeTime } from '../components/format.js';
import { escapeHtml } from '../utils.js';

const CATEGORY_ICON = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
`;

async function loadCategories() {
    const categories = await getCategories();
    document.getElementById('category-grid').innerHTML = categories
        .map(category => {
            const postCount = Number(category.postCount) || 0;
            const color = getAvatarColor(category.name);

            const lastActivity = category.lastThreadTitle
                ? `
                    <a href="thread.html?id=${category.lastThreadId}" class="category-last-thread">${escapeHtml(category.lastThreadTitle)}</a>
                    <div class="category-last-meta">${formatRelativeTime(category.lastActivity)} · ${escapeHtml(category.lastThreadAuthor)}</div>
                `
                : `<div class="category-last-meta">No threads yet</div>`;

            return `
                <div class="category-row">
                    <a class="category-row-link" href="forum.html?categoryId=${category.id}">
                        <span class="category-icon" style="background: ${color}33; color: ${color}">
                            ${CATEGORY_ICON}
                        </span>
                    </a>
                    <a class="category-row-link category-row-main" href="forum.html?categoryId=${category.id}">
                        <h3>${escapeHtml(category.name)}</h3>
                        <p>${escapeHtml(category.description)}</p>
                    </a>
                    <span class="category-row-stats">
                        <strong>${postCount}</strong>
                        <span>${postCount === 1 ? 'post' : 'posts'}</span>
                    </span>
                    <span class="category-row-activity">
                        ${lastActivity}
                    </span>
                </div>
            `;
        })
        .join('');
}

async function loadRecentThreads() {
    const threads = await getRecentThreads(5);
    document.getElementById('recent-threads-list').innerHTML = threads
        .map(thread => {
            const author = thread.author || 'anonymous';
            const avatarColor = thread.author ? getAvatarColor(thread.author) : '#475569';
            const initial = thread.author ? thread.author.charAt(0).toUpperCase() : '?';

            return `
                <div class="recent-thread-item">
                    <span class="avatar avatar-sm" style="background: ${avatarColor}">${escapeHtml(initial)}</span>
                    <div class="recent-thread-body">
                        <a href="thread.html?id=${thread.id}">${escapeHtml(thread.title)}</a>
                        <div class="recent-thread-meta">
                            <span class="category-tag">${escapeHtml(thread.category)}</span>
                            <span class="dot">·</span>
                            <span class="author-name">${escapeHtml(author)}</span>
                            <span class="time">${formatRelativeTime(thread.created_at)}</span>
                        </div>
                    </div>
                </div>
            `;
        })
        .join('') || '<p class="recent-thread-meta">No threads yet.</p>';
}

async function loadNewMembers() {
    const users = await getRecentUsers(5);
    document.getElementById('new-members-list').innerHTML = users
        .map(user => `
            <li>
                <span class="avatar avatar-sm" style="background: ${getAvatarColor(user.username)}">
                    ${escapeHtml(user.username.charAt(0).toUpperCase())}
                </span>
                ${escapeHtml(user.username)}
                <span class="member-date">${formatDate(user.created_at)}</span>
            </li>
        `)
        .join('');
}

async function loadStats() {
    const stats = await getStats();

    document.getElementById('hero-stats').innerHTML = `
        <div class="hero-stat"><strong>${stats.users}</strong><span>Members</span></div>
        <div class="hero-stat"><strong>${stats.threads}</strong><span>Threads</span></div>
        <div class="hero-stat"><strong>${stats.posts}</strong><span>Posts</span></div>
    `;

    document.getElementById('community-stats').innerHTML = `
        <div class="stat-row"><span>Members</span><span>${stats.users}</span></div>
        <div class="stat-row"><span>Active sessions</span><span>${stats.activeSessions}</span></div>
        <div class="stat-row"><span>Posts</span><span>${stats.posts}</span></div>
    `;

    document.getElementById('forum-stats').innerHTML = `
        <div class="stat-row"><span>Threads</span><span>${stats.threads}</span></div>
        <div class="stat-row"><span>Posts</span><span>${stats.posts}</span></div>
        <div class="stat-row"><span>Members</span><span>${stats.users}</span></div>
    `;
}

loadCategories();
loadRecentThreads();
loadNewMembers();
loadStats();
