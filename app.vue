<template>
  <div v-if="!isLoading">
    <NuxtLayout>
      <NuxtPage />

      <ClientOnly>
        <div class="footer">Current version: {{ currentVersion }}</div>
      </ClientOnly>

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
import {
  storeToRefs,
  useDropdownArea,
  useGlobalUpload,
  useRoute,
  useUserStore,
} from '#imports';

const isLoading = ref(true);
const currentVersion = useState();

const route = useRoute();

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);

const { registerKeyEvents, removeKeyEvents, isPreviewing } = useGlobalUpload();
const { dropdownArea, registerDropdownAreaEvents, removeDropdownAreaEvents } =
  useDropdownArea();

if (import.meta.server) {
  const path = await import('node:path');
  const fs = await import('node:fs/promises');
  const currentDir = process.cwd();

  const version = await fs.readFile(path.join(currentDir, 'version'));
  currentVersion.value = version.toString();
}

if (import.meta.client) {
  await userStore.authenticate();

  if (route.meta.isAuthed && !isAuthenticated.value) {
    await navigateTo('/login');
  }

  if (route.meta.isAuthed && isAuthenticated.value) {
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

.footer {
  color: rgba(255, 255, 255, 0.2);
  margin-top: 4rem;
  margin-bottom: 2rem;
}

.dropdown-area {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100vh;

  background-color: #000000bb;
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
