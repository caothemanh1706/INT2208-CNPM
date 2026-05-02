const API_URL = '/api';

export const auth = {
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token);
  },
  getToken: () => {
    return localStorage.getItem('auth_token');
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  fetch: async (endpoint: string, options: any = {}) => {
    const token = auth.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      auth.logout();
      window.location.reload();
    }

    return response;
  }
};
