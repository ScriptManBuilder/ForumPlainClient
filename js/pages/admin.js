import { me } from '../api/auth.api.js';
import { escapeHtml } from '../utils.js';
import { renderDashboard } from './admin/dashboard.js';
import { renderUsers } from './admin/users.js';
import { renderSessions } from './admin/sessions.js';
import { renderAudit } from './admin/audit.js';
import { renderLogs } from './admin/logs.js';

const VIEWS = {
    dashboard: renderDashboard,
    users: renderUsers,
    sessions: renderSessions,
    audit: renderAudit,
    logs: renderLogs,
};

const content = document.getElementById('admin-content');
let currentUser = null;

function getViewName() {
    const name = window.location.hash.slice(1);
    return VIEWS[name] ? name : 'dashboard';
}

async function renderCurrentView() {
    const viewName = getViewName();

    document.querySelectorAll('.admin-nav a[data-view]').forEach(link => {
        link.classList.toggle('active', link.dataset.view === viewName);
    });

    content.innerHTML = '<p class="admin-muted">Loading…</p>';

    try {
        await VIEWS[viewName](content, { currentUser });
    } catch (err) {
        content.innerHTML = `<p class="error-message">${escapeHtml(err.message)}</p>`;
    }
}

async function init() {
    try {
        currentUser = await me();
    } catch (err) {
        window.location.href = 'login.html';
        return;
    }

    if (currentUser.role !== 'admin') {
        window.location.href = '403.html';
        return;
    }

    window.addEventListener('hashchange', renderCurrentView);
    renderCurrentView();
}

init();
