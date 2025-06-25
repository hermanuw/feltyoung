import { defineStore } from 'pinia';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null
  }),
  actions: {
    setAuth(user, token) {
      this.user = user;
      this.accessToken = token;
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
