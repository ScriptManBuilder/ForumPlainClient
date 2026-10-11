import { register } from '../api/auth.api.js';
import { setupPasswordToggle } from '../components/passwordToggle.js';

const form = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');

setupPasswordToggle(document.querySelector('.password-field'));

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const formData = new FormData(form);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        await register({ username, email, password });
        window.location.href = 'login.html';
    } catch (err) {
        errorMessage.textContent = err.message;
    }
});
