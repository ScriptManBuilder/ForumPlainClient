import { me } from '../api/auth.api.js';
import { setPostHidden, setThreadLocked } from '../api/moderation.api.js';

const postForm = document.getElementById('post-form');
const postMessage = document.getElementById('post-message');
const threadForm = document.getElementById('thread-form');
const threadMessage = document.getElementById('thread-message');

postForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    postMessage.textContent = '';

    const postId = new FormData(postForm).get('postId');
    const hidden = event.submitter.value === 'hide';

    try {
        await setPostHidden(postId, hidden);
        postMessage.textContent = `Post ${postId} ${hidden ? 'hidden' : 'unhidden'}.`;
    } catch (err) {
        postMessage.textContent = err.message;
    }
});

threadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    threadMessage.textContent = '';

    const threadId = new FormData(threadForm).get('threadId');
    const locked = event.submitter.value === 'lock';

    try {
        await setThreadLocked(threadId, locked);
        threadMessage.textContent = `Thread ${threadId} ${locked ? 'locked' : 'unlocked'}.`;
    } catch (err) {
        threadMessage.textContent = err.message;
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
