import { getAuditLog } from '../../api/admin.api.js';
import { describeAction, renderActionTable } from './actions.js';

export async function renderAudit(container) {
    container.innerHTML = `
        <div class="admin-header">
            <h1>Audit log</h1>
            <p class="admin-muted">Every action taken by admins and moderators: role changes, bans, hidden posts, locked threads, revoked sessions.</p>
        </div>

        <div class="admin-toolbar">
            <input type="search" id="audit-search" placeholder="Filter by actor or action">
        </div>

        <div id="audit-table"></div>
    `;

    const search = container.querySelector('#audit-search');
    const table = container.querySelector('#audit-table');
    const actions = await getAuditLog(200);

    function draw() {
        const query = search.value.trim().toLowerCase();
        const visible = actions.filter(entry => !query
            || entry.actor.toLowerCase().includes(query)
            || describeAction(entry).toLowerCase().includes(query));

        table.innerHTML = renderActionTable(visible);
    }

    search.addEventListener('input', draw);
    draw();
}
