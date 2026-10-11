import { me } from '../api/auth.api.js';
import { getCategories, createThread } from '../api/forum.api.js';
import { escapeHtml } from '../utils.js';

const params = new URLSearchParams(window.location.search);
const preselectedCategoryId = params.get('categoryId');

const form = document.getElementById('create-thread-form');
const categorySelect = document.getElementById('category-select');
const errorMessage = document.getElementById('error-message');

async function init() {
    try {
        await me();
    } catch (err) {
        window.location.href = 'login.html';
        return;
    }

    const categories = await getCategories();
    categorySelect.innerHTML = categories
        .map(category => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
        .join('');

    if (preselectedCategoryId) {
        categorySelect.value = preselectedCategoryId;
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const formData = new FormData(form);
    const categoryId = formData.get('categoryId');
    const title = formData.get('title');
    const isAnonymous = formData.get('isAnonymous') === 'on';

    try {
        const thread = await createThread({ categoryId, title, isAnonymous });
        window.location.href = `thread.html?id=${thread.id}`;
    } catch (err) {
        errorMessage.textContent = err.message;
    }
});

init();
