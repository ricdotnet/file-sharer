import axios from 'axios';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const isAuthenticated = ref(false);
  const authToken = ref<string | undefined>();
  const path = useRoute().path;

  async function authenticate() {
    if (path.includes('/login')) {
      return;
    }

    try {
      const { data } = await axios<{
        isAuthenticated: boolean;
        authToken: string;
      }>('/api/user/me');

      isAuthenticated.value = data.isAuthenticated;
      authToken.value = data.authToken;
    } catch {
      isAuthenticated.value = false;
      authToken.value = undefined;
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
