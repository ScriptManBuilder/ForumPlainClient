import { me } from '../api/auth.api.js';
import { getPosts, createPost, updatePost, deletePost } from '../api/forum.api.js';

const params = new URLSearchParams(window.location.search);
const threadId = params.get('id');

const postsList = document.getElementById('posts-list');
const postFormWrapper = document.getElementById('post-form-wrapper');
const loginToReply = document.getElementById('login-to-reply');
const postForm = document.getElementById('post-form');
const errorMessage = document.getElementById('error-message');

let currentUser = null;

async function loadCurrentUser() {
    try {
        currentUser = await me();
    } catch (err) {
        currentUser = null;
    }
}

function renderPost(post) {
    const isOwner = currentUser && currentUser.username === post.author;

    return `
        <div class="post-item" data-id="${post.id}">
            <p class="post-author">${post.author || 'anonymous'}${post.is_hidden ? ' (hidden)' : ''}</p>
            <p class="post-content">${post.content}</p>
            ${isOwner ? `
                <button class="edit-btn" data-id="${post.id}">Edit</button>
                <button class="delete-btn" data-id="${post.id}">Delete</button>
            ` : ''}
        </div>
    `;
}

async function loadPosts() {
    const posts = await getPosts(threadId);
    postsList.innerHTML = posts.map(renderPost).join('');

    postsList.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('Delete this post?')) return;
            await deletePost(btn.dataset.id);
            loadPosts();
        });
    });

    postsList.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => startEdit(btn.dataset.id));
    });
}

function startEdit(postId) {
    const postItem = postsList.querySelector(`.post-item[data-id="${postId}"]`);
    const contentEl = postItem.querySelector('.post-content');
    const currentText = contentEl.textContent;

    postItem.innerHTML = `
        <textarea class="edit-textarea" rows="3">${currentText}</textarea>
        <button class="save-edit-btn">Save</button>
        <button class="cancel-edit-btn">Cancel</button>
    `;

    postItem.querySelector('.save-edit-btn').addEventListener('click', async () => {
        const newContent = postItem.querySelector('.edit-textarea').value;
        await updatePost(postId, newContent);
        loadPosts();
    });

    postItem.querySelector('.cancel-edit-btn').addEventListener('click', loadPosts);
}

postForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const content = new FormData(postForm).get('content');

    try {
        await createPost({ threadId, content });
        postForm.reset();
        loadPosts();
    } catch (err) {
        errorMessage.textContent = err.message;
    }
});

async function init() {
    await loadCurrentUser();

    if (currentUser) {
        postFormWrapper.style.display = 'block';
    } else {
        loginToReply.style.display = 'block';
    }

    await loadPosts();
}

init();
