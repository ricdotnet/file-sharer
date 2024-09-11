<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>

<script setup lang="ts">
  import '~/assets/main.css';
  import { userStore } from './stores/userStore';

  const { authenticate, isAuthenticated } = userStore();

  if (process.client) {
    await authenticate();

    
  }
</script>
