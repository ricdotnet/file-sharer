import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const isAuthenticated = ref(false);

  async function authenticate() {
    const token = localStorage.getItem('token');

    if (!token) {
      isAuthenticated.value = false;
      return;
    }

    const response = await fetch('/api/user/auth', {
      headers: {
        Authorization: `${token}`,
      },
    });
    const data = await response.json();

    isAuthenticated.value = data.isAuthenticated;
  }

  function setIsAuthenticated(value: boolean) {
    isAuthenticated.value = value;
  }

  function logout() {
    localStorage.removeItem('token');
    isAuthenticated.value = false;
  }

  return { isAuthenticated, authenticate, setIsAuthenticated, logout };
});
