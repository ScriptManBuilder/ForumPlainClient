import { getCategories, getRecentThreads } from '../api/forum.api.js';
import { getRecentUsers } from '../api/users.api.js';
import { getStats } from '../api/stats.api.js';
import { getAvatarColor } from '../components/avatar.js';

function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

async function loadCategories() {
    const categories = await getCategories();
    document.getElementById('category-grid').innerHTML = categories
        .map(category => `
            <a class="category-card" href="forum.html?categoryId=${category.id}">
                <h3>${category.name}</h3>
                <p>${category.description || ''}</p>
            </a>
        `)
        .join('');
}

async function loadRecentThreads() {
    const threads = await getRecentThreads(5);
    document.getElementById('recent-threads-list').innerHTML = threads
        .map(thread => `
            <div class="recent-thread-item">
                <a href="thread.html?id=${thread.id}">${thread.title}</a>
                <div class="recent-thread-meta">${thread.category} · ${thread.author ? thread.author : 'anonymous'}</div>
            </div>
        `)
        .join('') || '<p class="recent-thread-meta">No threads yet.</p>';
}

async function loadNewMembers() {
    const users = await getRecentUsers(5);
    document.getElementById('new-members-list').innerHTML = users
        .map(user => `
            <li>
                <span class="avatar avatar-sm" style="background: ${getAvatarColor(user.username)}">
                    ${user.username.charAt(0).toUpperCase()}
                </span>
                ${user.username}
                <span class="member-date">${formatDate(user.created_at)}</span>
            </li>
        `)
        .join('');
}

async function loadStats() {
    const stats = await getStats();

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
