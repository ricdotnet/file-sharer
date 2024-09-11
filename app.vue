<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  import '~/assets/main.css';
  import { useUserStore, storeToRefs } from '#imports';

  const userStore = useUserStore();
  const { isAuthenticated } = storeToRefs(userStore);

  if (process.client) {
    await userStore.authenticate();

    if (!isAuthenticated.value) {
      await navigateTo('/login');
    }
  }
</script>
