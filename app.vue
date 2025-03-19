<template>
  <div v-if="!isLoading">
    <NuxtLayout>
      <NuxtPage />

      <UploadImageDialog :is-open="isPreviewing" />
    </NuxtLayout>

    <ClientOnly>
      <div v-if="isAuthenticated" ref="dropdownArea" class="dropdown-area">
        <span class="label">Drop your file here.</span>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
  import '~/assets/main.css';
  import { storeToRefs, useDropdownArea, useGlobalUpload, useRoute, useUserStore } from '#imports';

  const isLoading = ref(true);

  const route = useRoute();

  const userStore = useUserStore();
  const { isAuthenticated } = storeToRefs(userStore);

  const { registerKeyEvents, removeKeyEvents, isPreviewing } = useGlobalUpload();
  const { dropdownArea, registerDropdownAreaEvents, removeDropdownAreaEvents } = useDropdownArea();

  if (import.meta.client && route.meta.isAuthed) {
    await userStore.authenticate();

    if (!isAuthenticated.value) {
      await navigateTo('/login');
    }

    if (isAuthenticated.value) {
      registerKeyEvents();
      registerDropdownAreaEvents();
    }
  }

  watch(isAuthenticated, async () => {
    registerKeyEvents();
    registerDropdownAreaEvents();

    if (!isAuthenticated.value) {
      removeKeyEvents();
      removeDropdownAreaEvents();
    }
  });

  isLoading.value = false;
</script>

<style scoped>
  .show {
    opacity: 1 !important;
  }

  .dropdown-area {
    position: absolute;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

    background-color: #000000BB;
    outline: 0.3rem dashed var(--air-blue);
    outline-offset: -1.33rem;

    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    opacity: 0;

    .label {
      font-size: 2rem;
    }
  }
</style>
