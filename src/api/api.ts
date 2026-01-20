import {BASE_URL} from '../config';
let authToken: string | undefined;

export const setAuthToken = (token?: string) => {
  authToken = token;
};

const API = {
  post: async (path: string, body: unknown) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      throw new Error(errorBody?.message || errorBody?.error || 'API error');
    }
    const data = await res.json();
    return { data };
  },
  get: async (path: string) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      throw new Error(errorBody?.message || 'API error');
    }
    const data = await res.json();
    return { data };
  },
};

export default API;
