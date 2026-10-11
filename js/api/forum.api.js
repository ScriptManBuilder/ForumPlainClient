import { apiRequest } from '../utils.js';

function getCategories() {
    return apiRequest('/categories');
}

function getThreads(categoryId) {
    return apiRequest(`/threads?categoryId=${categoryId}`);
}

function getRecentThreads(limit = 5) {
    return apiRequest(`/threads/recent?limit=${limit}`);
}

function createThread({ categoryId, title, isAnonymous }) {
    return apiRequest('/threads', {
        method: 'POST',
        body: { categoryId, title, isAnonymous },
    });
}

function getPosts(threadId) {
    return apiRequest(`/posts?threadId=${threadId}`);
}

function createPost({ threadId, content }) {
    return apiRequest('/posts', {
        method: 'POST',
        body: { threadId, content },
    });
}

function updatePost(postId, content) {
    return apiRequest(`/posts/${postId}`, {
        method: 'PATCH',
        body: { content },
    });
}

function deletePost(postId) {
    return apiRequest(`/posts/${postId}`, { method: 'DELETE' });
}

export { getCategories, getThreads, getRecentThreads, createThread, getPosts, createPost, updatePost, deletePost };
