import { me, logout } from '../api/auth.api.js';

const profileInfo = document.getElementById('profile-info');
const logoutBtn = document.getElementById('logout-btn');

async function loadProfile() {
    try {
        const user = await me();
        const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        profileInfo.innerHTML = `
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Joined:</strong> ${joinedDate}</p>
        `;
    } catch (err) {
        window.location.href = 'login.html';
    }
}

logoutBtn.addEventListener('click', async () => {
    await logout();
    window.location.href = 'login.html';
});

loadProfile();
