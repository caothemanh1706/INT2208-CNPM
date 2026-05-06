const API_URL = '/api';

export const auth = {
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token);
  },
  getToken: () => {
    return localStorage.getItem('auth_token');
  },
  isLoggedIn: () => {
    return !!localStorage.getItem('auth_token');
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
  getInitials: () => {
    const user = auth.getUser();
    if (!user) return '?';
    const name = user.displayName || user.username || user.email || '';
    return name.slice(0, 2).toUpperCase();
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
      window.location.href = '/login';
    }

    return response;
  }
};
