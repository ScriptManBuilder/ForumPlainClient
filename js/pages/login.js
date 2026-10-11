import { login } from '../api/auth.api.js';
import { setupPasswordToggle } from '../components/passwordToggle.js';

const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

setupPasswordToggle(document.querySelector('.password-field'));

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        await login({ email, password });
        window.location.href = 'index.html';
    } catch (err) {
        errorMessage.textContent = err.message;
    }
});
