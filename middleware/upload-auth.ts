export default defineNuxtRouteMiddleware((to, from) => {
  if (to.fullPath.includes('/upload')) {
    const authKey = localStorage.getItem('auth-key');

    if (!authKey) {
      return navigateTo('/');
    }
  }
});