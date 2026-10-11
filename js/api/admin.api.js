import { apiRequest } from '../utils.js';

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

export { listUsers, changeRole, setBanned };
