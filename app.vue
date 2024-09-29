<template>
  <div v-if="!isLoading">
    <NuxtLayout>
      <NuxtPage/>

      <UploadImageDialog :is-open="isUploading" />
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

const { registerKeyEvents, removeKeyEvents, isUploading } = useGlobalUpload();

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

watch(isAuthenticated, async () => {
  registerKeyEvents();

  if (!isAuthenticated.value) {
    removeKeyEvents();
  }
});

isLoading.value = false;
</script>
