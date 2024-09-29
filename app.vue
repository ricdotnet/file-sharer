<template>
  <div v-if="!isLoading">
    <NuxtLayout>
      <NuxtPage/>

      <UploadImageDialog v-if="isUploading"/>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import '~/assets/main.css';
import { storeToRefs, useUserStore } from '#imports';
import { useGlobalUpload } from '~/composables/useGlobalUpload';

const isLoading = ref(true);

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);

const { registerKeyEvents, isUploading } = useGlobalUpload();

if (process.client) {
  await userStore.authenticate();

  if (!isAuthenticated.value) {
    localStorage.removeItem('token');
    await navigateTo('/login');
  }

  if (isAuthenticated.value) {
    registerKeyEvents();
  }
}

isLoading.value = false;
</script>
