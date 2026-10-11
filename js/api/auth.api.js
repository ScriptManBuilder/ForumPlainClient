import { apiRequest } from '../utils.js';

function register({ username, email, password }) {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: { username, email, password },
    });
}

function login({ email, password }) {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
    });
}

function logout() {
    return apiRequest('/auth/logout', { method: 'POST' });
}

function me() {
    return apiRequest('/auth/me');
}

export { register, login, logout, me };
