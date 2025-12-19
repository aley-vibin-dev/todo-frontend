// src/api/api.ts
let authToken: string | undefined;

export const setAuthToken = (token?: string) => {
  authToken = token;
};

const API = {
  post: async (path: string, body: unknown) => {
    const res = await fetch(`http://localhost:4000${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return { data };
  },
};

export default API;
