export default defineNuxtRouteMiddleware((to, from) => {
  if (to.fullPath.includes('/upload')) {
    if (import.meta.server) return navigateTo('/');

    const authKey = localStorage.getItem('auth-key');

    if (!authKey) {
      return navigateTo('/');
    }
  }
});
