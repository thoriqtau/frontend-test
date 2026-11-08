export const userFetch = async ({ signal } = {}) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users`,
        { signal },
    );

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return response.json();
};