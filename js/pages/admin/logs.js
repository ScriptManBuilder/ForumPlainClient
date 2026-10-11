import { getRequestLogs } from '../../api/admin.api.js';
import { escapeHtml } from '../../utils.js';
import { formatDateTime } from '../../components/format.js';

const STATUS_FILTERS = ['all', '2xx', '3xx', '4xx', '5xx'];

function statusTone(status) {
    if (status >= 500) return 'badge-danger';
    if (status >= 400) return 'badge-warning';
    return 'badge-success';
}

function renderRow(log) {
    return `
        <tr>
            <td class="nowrap admin-muted">${formatDateTime(log.created_at)}</td>
            <td><span class="badge">${escapeHtml(log.method)}</span></td>
            <td class="log-path"><code>${escapeHtml(log.path)}</code></td>
            <td><span class="badge ${statusTone(log.status)}">${log.status}</span></td>
            <td class="nowrap admin-muted">${log.duration_ms} ms</td>
            <td>${log.username ? escapeHtml(log.username) : '<span class="admin-muted">guest</span>'}</td>
            <td><code>${escapeHtml((log.ip || '').replace(/^::ffff:/, ''))}</code></td>
        </tr>
    `;
}

export async function renderLogs(container) {
    container.innerHTML = `
        <div class="admin-header">
            <h1>Request logs</h1>
            <p class="admin-muted">Every HTTP request the server handled — who called what, the result, and how long it took.</p>
        </div>

        <div class="admin-toolbar">
            <input type="search" id="logs-search" placeholder="Filter by path or user">
            <div class="filter-tabs" id="logs-filter">
                ${STATUS_FILTERS.map(status => `
                    <button data-status="${status}" class="${status === 'all' ? 'active' : ''}">${status}</button>
                `).join('')}
            </div>
            <button class="btn-small btn-ghost" id="logs-refresh">Refresh</button>
        </div>

        <div class="table-wrap">
            <table class="admin-table">
                <thead>
                    <tr><th>Time</th><th>Method</th><th>Path</th><th>Status</th><th>Duration</th><th>User</th><th>IP</th></tr>
                </thead>
                <tbody id="logs-body"></tbody>
            </table>
        </div>
    `;

    const body = container.querySelector('#logs-body');
    const search = container.querySelector('#logs-search');
    const filterTabs = container.querySelector('#logs-filter');

    let status = 'all';
    let logs = [];

    function draw() {
        const query = search.value.trim().toLowerCase();
        const visible = logs.filter(log => !query
            || log.path.toLowerCase().includes(query)
            || (log.username || '').toLowerCase().includes(query));

        body.innerHTML = visible.length
            ? visible.map(renderRow).join('')
            : '<tr><td colspan="7" class="admin-muted">No requests match.</td></tr>';
    }

    async function load() {
        logs = await getRequestLogs({ status, limit: 300 });
        draw();
    }

    search.addEventListener('input', draw);
    container.querySelector('#logs-refresh').addEventListener('click', load);

    filterTabs.addEventListener('click', event => {
        const tab = event.target.closest('button[data-status]');
        if (!tab) return;
        status = tab.dataset.status;
        filterTabs.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn === tab));
        load();
    });

    await load();
}
