import { apiRequest } from '../utils.js';

function setPostHidden(postId, hidden) {
    return apiRequest(`/moderation/posts/${postId}/hidden`, {
        method: 'PATCH',
        body: { hidden },
    });
}

function setThreadLocked(threadId, locked) {
    return apiRequest(`/moderation/threads/${threadId}/locked`, {
        method: 'PATCH',
        body: { locked },
    });
}

export { setPostHidden, setThreadLocked };
