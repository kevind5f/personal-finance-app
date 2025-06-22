import { defineStore } from 'pinia';
import { $fetch } from 'ofetch';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    getUser: (state: AuthState) => state.user,
    getToken: (state: AuthState) => state.token,
    isLoggedIn: (state: AuthState) => state.isAuthenticated
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        });

        if (response.token) {
          this.token = response.token;
          this.user = response.user;
          this.isAuthenticated = true;
          localStorage.setItem('token', response.token);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error during login:', error);
        return false;
      }
    },

    async register(name: string, email: string, password: string) {
      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: { name, email, password }
        });

        if (response.token) {
          this.token = response.token;
          this.user = response.user;
          this.isAuthenticated = true;
          localStorage.setItem('token', response.token);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error during registration:', error);
        return false;
      }
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        this.clearAuth();
      }
    },

    async checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.clearAuth();
        return false;
      }

      try {
        const response = await $fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.user) {
          this.token = token;
          this.user = response.user;
          this.isAuthenticated = true;
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error checking auth:', error);
        this.clearAuth();
        return false;
      }
    },

    clearAuth() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  }
}); 