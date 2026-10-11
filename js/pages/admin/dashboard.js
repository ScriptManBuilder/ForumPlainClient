import { getDashboard } from '../../api/admin.api.js';
import { renderActionTable } from './actions.js';

export async function renderDashboard(container) {
    const { stats, recentActions } = await getDashboard();

    const cards = [
        { label: 'Users', value: stats.users },
        { label: 'Threads', value: stats.threads },
        { label: 'Posts', value: stats.posts },
        { label: 'Banned users', value: stats.banned, tone: stats.banned > 0 ? 'danger' : '' },
        { label: 'New users today', value: stats.newUsersToday },
        { label: 'New users (7 days)', value: stats.newUsersWeek },
        { label: 'Posts today', value: stats.postsToday },
        { label: 'Active sessions', value: stats.activeSessions },
    ];

    container.innerHTML = `
        <div class="admin-header">
            <h1>Dashboard</h1>
            <p class="admin-muted">Current state of the forum.</p>
        </div>

        <div class="stat-cards">
            ${cards.map(card => `
                <div class="stat-card ${card.tone || ''}">
                    <span>${card.label}</span>
                    <strong>${card.value}</strong>
                </div>
            `).join('')}
        </div>

        <section class="admin-section">
            <div class="admin-section-header">
                <h2>Recent admin &amp; moderator actions</h2>
                <a href="#audit">View full audit log →</a>
            </div>
            ${renderActionTable(recentActions)}
        </section>
    `;
}
