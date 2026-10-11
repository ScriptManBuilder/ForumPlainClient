import { me, logout } from '../api/auth.api.js';
import { getAvatarColor } from './avatar.js';

async function renderNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    navbar.classList.add('navbar');

    let user = null;
    try {
        user = await me();
    } catch (err) {
        user = null;
    }

    const links = `
        <div class="navbar-links">
            <a href="index.html">Home</a>
            <a href="forum.html">Forum</a>
            ${user && (user.role === 'moderator' || user.role === 'admin') ? '<a href="moderator.html">Moderator</a>' : ''}
            ${user && user.role === 'admin' ? '<a href="admin.html">Admin</a>' : ''}
        </div>
    `;

    const auth = user
        ? `
            <div class="navbar-auth">
                <a href="account.html" class="navbar-profile">
                    <span class="avatar" style="background: ${getAvatarColor(user.email)}">
                        ${user.username.charAt(0).toUpperCase()}
                    </span>
                    <span class="navbar-username">${user.username}</span>
                </a>
                <button id="logout-btn" class="btn-ghost">Logout</button>
            </div>
        `
        : `
            <div class="navbar-auth">
                <a href="login.html"><button class="btn-ghost">Login</button></a>
                <a href="register.html"><button>Register</button></a>
            </div>
        `;

    navbar.innerHTML = `
        <a href="index.html" class="navbar-brand">Forum</a>
        ${links}
        ${auth}
    `;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await logout();
            window.location.href = 'login.html';
        });
    }
}

renderNavbar();
