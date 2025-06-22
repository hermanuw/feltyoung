import { defineStore } from 'pinia';
import router from '../router';

import { fetchWrapper } from '../utils/helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async login(username, password) {
      const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });

      // update pinia state
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      router.push(this.returnUrl || '/dashboard/default');
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      router.push('/login');
    }
  }
});
