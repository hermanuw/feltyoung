import { defineStore } from 'pinia';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('accessToken') || null
  }),
  actions: {
    setAuth(user, token) {
      this.user = user;
      this.accessToken = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', token);
    },
    logout() {
      this.user = null;
      this.accessToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      router.push('/login');
    }
  }
});
