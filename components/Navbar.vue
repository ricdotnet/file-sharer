<template>
  <nav>
    <div class="container">
      <span class="title">FileSharer</span>

      <ClientOnly>
        <div v-if="isAuthenticated">
          <div class="links">
            <NuxtLink to="/">Files</NuxtLink>
            <NuxtLink to="/upload">Upload</NuxtLink>
            <button @click="onLogoutClick">Logout</button>
          </div>
        </div>
      </ClientOnly>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { useUserStore, storeToRefs } from '#imports';

  const userStore = useUserStore();
  const { isAuthenticated } = storeToRefs(userStore);

  async function onLogoutClick() {
    userStore.logout();
    navigateTo('/login');
  }
</script>

<style scoped>
  nav {
    background-color: var(--gun-metal);
    padding-block: 1rem;
    padding-inline: 2rem;
    display: flex;
    justify-content: center;

    .container {
      width: 900px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 2rem;
      }

      .links {
        display: flex;
        column-gap: 1rem;
        font-size: 1.15rem;
      }
    }
  }
</style>