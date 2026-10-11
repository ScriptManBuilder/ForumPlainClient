import { apiRequest } from '../utils.js';

function getDashboard() {
    return apiRequest('/admin/dashboard');
}

function listUsers() {
    return apiRequest('/admin/users');
}

function changeRole(userId, role) {
    return apiRequest(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: { role },
    });
}

function setBanned(userId, banned) {
    return apiRequest(`/admin/users/${userId}/ban`, {
        method: 'PATCH',
        body: { banned },
    });
}

function revokeUserSessions(userId) {
    return apiRequest(`/admin/users/${userId}/sessions`, { method: 'DELETE' });
}

function listSessions() {
    return apiRequest('/admin/sessions');
}

function revokeSession(sessionId) {
    return apiRequest(`/admin/sessions/${sessionId}`, { method: 'DELETE' });
}

function getAuditLog(limit = 200) {
    return apiRequest(`/admin/audit?limit=${limit}`);
}

function getRequestLogs({ status = 'all', limit = 200 } = {}) {
    return apiRequest(`/admin/logs?status=${encodeURIComponent(status)}&limit=${limit}`);
}

export {
    getDashboard,
    listUsers,
    changeRole,
    setBanned,
    revokeUserSessions,
    listSessions,
    revokeSession,
    getAuditLog,
    getRequestLogs,
};
