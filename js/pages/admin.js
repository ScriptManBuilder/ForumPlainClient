import { me } from '../api/auth.api.js';
import { listUsers, changeRole, setBanned } from '../api/admin.api.js';

const tableBody = document.getElementById('users-table-body');
const ROLES = ['user', 'moderator', 'admin'];

let currentUserId = null;

function renderRow(user) {
    const isSelf = user.id === currentUserId;

    const roleOptions = ROLES
        .map(role => `<option value="${role}" ${role === user.role ? 'selected' : ''}>${role}</option>`)
        .join('');

    return `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <select class="role-select" data-id="${user.id}" ${isSelf ? 'disabled' : ''}>
                    ${roleOptions}
                </select>
            </td>
            <td>
                <button
                    class="ban-btn ${user.is_banned ? 'unban' : ''}"
                    data-id="${user.id}"
                    data-banned="${user.is_banned ? 'true' : 'false'}"
                    ${isSelf ? 'disabled' : ''}
                >${user.is_banned ? 'Unban' : 'Ban'}</button>
            </td>
        </tr>
    `;
}

async function loadUsers() {
    const users = await listUsers();
    tableBody.innerHTML = users.map(renderRow).join('');

    tableBody.querySelectorAll('.role-select').forEach(select => {
        select.addEventListener('change', async () => {
            try {
                await changeRole(select.dataset.id, select.value);
                loadUsers();
            } catch (err) {
                alert(err.message);
                loadUsers();
            }
        });
    });

    tableBody.querySelectorAll('.ban-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const isBanned = btn.dataset.banned === 'true';
            try {
                await setBanned(btn.dataset.id, !isBanned);
                loadUsers();
            } catch (err) {
                alert(err.message);
            }
        });
    });
}

async function init() {
    let user;
    try {
        user = await me();
    } catch (err) {
        window.location.href = 'login.html';
        return;
    }

    if (user.role !== 'admin') {
        window.location.href = '403.html';
        return;
    }

    currentUserId = user.id;
    await loadUsers();
}

init();
