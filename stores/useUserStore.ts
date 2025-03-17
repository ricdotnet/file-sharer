import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
  const isAuthenticated = ref(false);
  const authToken = ref<string | undefined>();

  async function authenticate() {
    try {
      const { data } = await axios<{
        isAuthenticated: boolean;
        authToken: string;
      }>('/api/user/me');

      debugger;

      isAuthenticated.value = data.isAuthenticated;
      authToken.value = data.authToken;
    } catch (_error) {
      // ignore
    }
  }

  function setIsAuthenticated(value: boolean) {
    isAuthenticated.value = value;
  }

  function setAuthToken(value: string) {
    authToken.value = value;
  }

  return { isAuthenticated, authToken, authenticate, setIsAuthenticated, setAuthToken };
});
