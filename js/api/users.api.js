import { apiRequest } from '../utils.js';

function getRecentUsers(limit = 5) {
    return apiRequest(`/users/recent?limit=${limit}`);
}

export { getRecentUsers };
