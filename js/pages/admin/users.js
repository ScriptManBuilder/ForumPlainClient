import { listUsers, changeRole, setBanned, revokeUserSessions } from '../../api/admin.api.js';
import { escapeHtml } from '../../utils.js';
import { getAvatarColor } from '../../components/avatar.js';
import { formatDate } from '../../components/format.js';
import { showToast } from '../../components/notifications.js';

const ROLES = ['user', 'moderator', 'admin'];

const FILTERS = {
    all: () => true,
    staff: user => user.role !== 'user',
    banned: user => Boolean(user.is_banned),
};

function renderRow(user, currentUserId) {
    const isSelf = user.id === currentUserId;
    const disabled = isSelf ? 'disabled' : '';

    const roleOptions = ROLES
        .map(role => `<option value="${role}" ${role === user.role ? 'selected' : ''}>${role}</option>`)
        .join('');

    return `
        <tr>
            <td class="admin-muted">#${user.id}</td>
            <td>
                <div class="user-cell">
                    <span class="avatar avatar-sm" style="background: ${getAvatarColor(user.username)}">
                        ${escapeHtml(user.username.charAt(0).toUpperCase())}
                    </span>
                    <span>${escapeHtml(user.username)}${isSelf ? ' <em class="admin-muted">(you)</em>' : ''}</span>
                </div>
            </td>
            <td class="admin-muted">${escapeHtml(user.email)}</td>
            <td>
                <select data-action="role" data-id="${user.id}" ${disabled}>${roleOptions}</select>
            </td>
            <td>
                ${user.is_banned
                    ? '<span class="badge badge-danger">Banned</span>'
                    : '<span class="badge badge-success">Active</span>'}
            </td>
            <td>${Number(user.active_sessions)}</td>
            <td class="nowrap admin-muted">${formatDate(user.created_at)}</td>
            <td class="row-actions">
                <button
                    class="btn-small ${user.is_banned ? 'btn-success' : 'btn-danger'}"
                    data-action="ban"
                    data-id="${user.id}"
                    data-banned="${user.is_banned ? 'true' : 'false'}"
                    ${disabled}
                >${user.is_banned ? 'Unban' : 'Ban'}</button>
                <button
                    class="btn-small btn-ghost"
                    data-action="revoke"
                    data-id="${user.id}"
                    ${disabled || (Number(user.active_sessions) === 0 ? 'disabled' : '')}
                >Log out everywhere</button>
            </td>
        </tr>
    `;
}

export async function renderUsers(container, { currentUser }) {
    container.innerHTML = `
        <div class="admin-header">
            <h1>Users</h1>
            <p class="admin-muted">Manage roles, bans and sessions.</p>
        </div>

        <div class="admin-toolbar">
            <input type="search" id="user-search" placeholder="Search by username or email">
            <div class="filter-tabs" id="user-filter">
                <button data-filter="all" class="active">All</button>
                <button data-filter="staff">Staff</button>
                <button data-filter="banned">Banned</button>
            </div>
        </div>

        <div class="table-wrap">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th><th>User</th><th>Email</th><th>Role</th>
                        <th>Status</th><th>Sessions</th><th>Joined</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody id="users-body"></tbody>
            </table>
        </div>
    `;

    const body = container.querySelector('#users-body');
    const search = container.querySelector('#user-search');
    const filterTabs = container.querySelector('#user-filter');

    let users = await listUsers();
    let filter = 'all';

    function draw() {
        const query = search.value.trim().toLowerCase();
        const visible = users
            .filter(FILTERS[filter])
            .filter(user => !query
                || user.username.toLowerCase().includes(query)
                || user.email.toLowerCase().includes(query));

        body.innerHTML = visible.length
            ? visible.map(user => renderRow(user, currentUser.id)).join('')
            : '<tr><td colspan="8" class="admin-muted">No users match.</td></tr>';
    }

    async function reload() {
        users = await listUsers();
        draw();
    }

    async function runAction(action, successMessage) {
        try {
            await action();
            showToast(successMessage, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
        await reload();
    }

    search.addEventListener('input', draw);

    filterTabs.addEventListener('click', event => {
        const tab = event.target.closest('button[data-filter]');
        if (!tab) return;
        filter = tab.dataset.filter;
        filterTabs.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn === tab));
        draw();
    });

    body.addEventListener('change', event => {
        const select = event.target.closest('select[data-action="role"]');
        if (!select) return;
        runAction(() => changeRole(select.dataset.id, select.value), `Role changed to ${select.value}`);
    });

    body.addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const userId = button.dataset.id;

        if (button.dataset.action === 'ban') {
            const willBan = button.dataset.banned !== 'true';
            if (willBan && !confirm('Ban this user? They will be logged out immediately.')) return;
            runAction(() => setBanned(userId, willBan), willBan ? 'User banned' : 'User unbanned');
        }

        if (button.dataset.action === 'revoke') {
            if (!confirm('End all sessions of this user?')) return;
            runAction(() => revokeUserSessions(userId), 'All sessions revoked');
        }
    });

    draw();
}
