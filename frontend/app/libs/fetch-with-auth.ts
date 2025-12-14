
/**
 * Server-side fetch wrapper that automatically adds Bearer token from HttpOnly cookie.
 * @param url The API endpoint to call
 * @param options Optional fetch options
 */
export async function fetchWithAuth(url: string, token_value: string | undefined, options: RequestInit = {}) {
    const token = token_value
    if (!token) throw new Error('Unauthorized');

    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    const res = await fetch(url, {
        ...options,
        headers,
    });

    if (!res.ok) {
        if (res.status === 401) throw new Error('Token expired or invalid');
        throw new Error(`API request failed: ${res.status}`);
    }

    return res.json();
}