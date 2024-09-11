import { defineStore } from 'pinia';

export const userStore = defineStore('user', () => {
  const isAuthenticated = ref(false);

  async function authenticate() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/user/auth', {
      headers: {
        Authorization: `${token}`,
      },
    });
    const data = await response.json();

    isAuthenticated.value = data.isAuthenticated;
  };

  return { isAuthenticated, authenticate };
});
