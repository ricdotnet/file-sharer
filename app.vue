<template>
  <div v-if="!isLoading">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  import '~/assets/main.css';
  import { useUserStore, storeToRefs } from '#imports';

  const userStore = useUserStore();
  const { isAuthenticated } = storeToRefs(userStore);
  const isLoading = ref(true);

  if (process.client) {
    await userStore.authenticate();

    if (!isAuthenticated.value) {
      localStorage.removeItem('token');
      await navigateTo('/login');
    }
  }

  isLoading.value = false;
</script>
