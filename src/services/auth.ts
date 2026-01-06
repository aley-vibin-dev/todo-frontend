import api, { setAuthToken } from '@/api/api';

export type UserRole = 'admin' | 'manager' | 'user';
interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

//login
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await api.post('/auth/login', { email, password });
  setAuthToken(data.token); // save token for future requests
  return data;
};

//signup
export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post('/auth/signup', {
    name,
    email,
    password,
  });

  return res.data;
};
