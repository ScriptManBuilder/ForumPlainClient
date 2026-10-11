const API_BASE_URL = 'http://localhost:3000/api';

class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}

async function apiRequest(path, { method = 'GET', body } = {}) {
    const hasBody = body !== undefined;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        credentials: 'include',
        headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
        body: hasBody ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        const message = (data && data.error) || 'Request failed';
        throw new ApiError(message, response.status);
    }

    return data;
}

export { apiRequest, ApiError };
