import { getCategories, getThreads } from '../api/forum.api.js';

const categoriesList = document.getElementById('categories-list');
const threadsHeading = document.getElementById('threads-heading');
const threadsList = document.getElementById('threads-list');
const createThreadLink = document.getElementById('create-thread-link');

async function loadCategories() {
    const categories = await getCategories();

    categoriesList.innerHTML = categories
        .map(category => `<button class="category-btn" data-id="${category.id}">${category.name}</button>`)
        .join('');

    categoriesList.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => loadThreads(btn.dataset.id));
    });
}

async function loadThreads(categoryId) {
    const threads = await getThreads(categoryId);

    threadsHeading.style.display = 'block';
    createThreadLink.style.display = 'inline-block';
    createThreadLink.href = `create-thread.html?categoryId=${categoryId}`;

    threadsList.innerHTML = threads
        .map(thread => `
            <div class="thread-item">
                <a href="thread.html?id=${thread.id}">${thread.title}</a>
                <span class="thread-author">${thread.author ? `by ${thread.author}` : 'anonymous'}</span>
            </div>
        `)
        .join('');
}

const preselectedCategoryId = new URLSearchParams(window.location.search).get('categoryId');

loadCategories().then(() => {
    if (preselectedCategoryId) {
        loadThreads(preselectedCategoryId);
    }
});
