import { escapeHtml } from '../../utils.js';
import { formatDateTime } from '../../components/format.js';

const ACTION_LABELS = {
    ban_user: 'banned user',
    unban_user: 'unbanned user',
    hide_post: 'hid post',
    show_post: 'restored post',
    lock_thread: 'locked thread',
    unlock_thread: 'unlocked thread',
    revoke_session: 'revoked a session of user',
    revoke_all_sessions: 'revoked all sessions of user',
};

function describeAction(entry) {
    if (entry.action.startsWith('change_role:')) {
        const role = entry.action.split(':')[1];
        return `changed role of user #${entry.target_id} → ${role}`;
    }

    const label = ACTION_LABELS[entry.action] || entry.action;
    return `${label} #${entry.target_id}`;
}

function renderActionTable(actions) {
    if (!actions.length) {
        return '<p class="admin-muted">No actions recorded yet.</p>';
    }

    const rows = actions.map(entry => `
        <tr>
            <td class="nowrap admin-muted">${formatDateTime(entry.created_at)}</td>
            <td><strong>${escapeHtml(entry.actor)}</strong></td>
            <td>${escapeHtml(describeAction(entry))}</td>
            <td><span class="badge">${escapeHtml(entry.target_type)}</span></td>
        </tr>
    `).join('');

    return `
        <div class="table-wrap">
            <table class="admin-table">
                <thead>
                    <tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

export { describeAction, renderActionTable };
