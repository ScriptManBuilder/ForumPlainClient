import { me } from '../api/auth.api.js';
import { setPostHidden, setThreadLocked } from '../api/moderation.api.js';

const postForm = document.getElementById('post-form');
const postMessage = document.getElementById('post-message');
const threadForm = document.getElementById('thread-form');
const threadMessage = document.getElementById('thread-message');

function showMessage(el, text, status) {
    el.textContent = text;
    el.classList.remove('success', 'error');
    el.classList.add(status);
}

postForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const postId = new FormData(postForm).get('postId');
    const hidden = event.submitter.value === 'hide';

    try {
        await setPostHidden(postId, hidden);
        showMessage(postMessage, `Post ${postId} ${hidden ? 'hidden' : 'unhidden'}.`, 'success');
    } catch (err) {
        showMessage(postMessage, err.message, 'error');
    }
});

threadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const threadId = new FormData(threadForm).get('threadId');
    const locked = event.submitter.value === 'lock';

    try {
        await setThreadLocked(threadId, locked);
        showMessage(threadMessage, `Thread ${threadId} ${locked ? 'locked' : 'unlocked'}.`, 'success');
    } catch (err) {
        showMessage(threadMessage, err.message, 'error');
    }
});

async function init() {
    let user;
    try {
        user = await me();
    } catch (err) {
        window.location.href = 'login.html';
        return;
    }

    if (user.role !== 'moderator' && user.role !== 'admin') {
        window.location.href = '403.html';
    }
}

init();
