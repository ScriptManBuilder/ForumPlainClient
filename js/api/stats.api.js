import { apiRequest } from '../utils.js';

function getStats() {
    return apiRequest('/stats');
}

export { getStats };
