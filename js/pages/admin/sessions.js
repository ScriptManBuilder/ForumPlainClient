import { listSessions, revokeSession } from '../../api/admin.api.js';
import { escapeHtml } from '../../utils.js';
import { formatDateTime } from '../../components/format.js';
import { showToast } from '../../components/notifications.js';

function shortUserAgent(userAgent) {
    if (!userAgent) return 'Unknown';
    if (/Edg\//.test(userAgent)) return 'Edge';
    if (/Chrome\//.test(userAgent)) return 'Chrome';
    if (/Firefox\//.test(userAgent)) return 'Firefox';
    if (/Safari\//.test(userAgent)) return 'Safari';
    if (/curl\//.test(userAgent)) return 'curl';
    if (/PowerShell/.test(userAgent)) return 'PowerShell';
    return userAgent.slice(0, 24);
}

function formatIp(ip) {
    return ip ? ip.replace(/^::ffff:/, '') : '—';
}

function renderRow(session) {
    return `
        <tr>
            <td class="nowrap">
                <code>#${session.id} · ${escapeHtml(session.token_preview)}…</code>
                ${session.is_current ? '<span class="badge badge-success">this session</span>' : ''}
            </td>
            <td><strong>${escapeHtml(session.username)}</strong></td>
            <td><code>${escapeHtml(formatIp(session.ip))}</code></td>
            <td title="${escapeHtml(session.user_agent)}">${escapeHtml(shortUserAgent(session.user_agent))}</td>
            <td class="nowrap admin-muted">${formatDateTime(session.created_at)}</td>
            <td class="nowrap admin-muted">${formatDateTime(session.expires_at)}</td>
            <td>
                <button class="btn-small btn-danger" data-id="${session.id}" ${session.is_current ? 'disabled' : ''}>
                    Revoke
                </button>
            </td>
        </tr>
    `;
}

export async function renderSessions(container) {
    container.innerHTML = `
        <div class="admin-header">
            <h1>Active sessions</h1>
            <p class="admin-muted">Every logged-in device. Revoking a session logs that device out immediately.</p>
        </div>

        <div class="table-wrap">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Session</th><th>User</th><th>IP</th><th>Client</th>
                        <th>Created</th><th>Expires</th><th></th>
                    </tr>
                </thead>
                <tbody id="sessions-body"></tbody>
            </table>
        </div>
    `;

    const body = container.querySelector('#sessions-body');

    async function draw() {
        const sessions = await listSessions();
        body.innerHTML = sessions.length
            ? sessions.map(renderRow).join('')
            : '<tr><td colspan="7" class="admin-muted">No active sessions.</td></tr>';
    }

    body.addEventListener('click', async event => {
        const button = event.target.closest('button[data-id]');
        if (!button || !confirm('Revoke this session?')) return;

        try {
            await revokeSession(button.dataset.id);
            showToast('Session revoked', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
        await draw();
    });

    await draw();
}
