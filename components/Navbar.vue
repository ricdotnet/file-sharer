<template>
  <nav>
    <div class="container">
      <span class="title">FileSharer</span>

      <ClientOnly>
        <div v-if="isAuthenticated" class="authenticated-block">
          <div>
            <Button label="Get API Token" @click="() => onGetApiTokenClick()"/>
          </div>
          <div class="links">
            <NuxtLink to="/">Files</NuxtLink>
            <NuxtLink to="/upload">Upload</NuxtLink>
            <a href="/logout">Logout</a>
          </div>
        </div>
      </ClientOnly>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore, storeToRefs, useToaster } from '#imports';
import request from '~/utils/request';

  const userStore = useUserStore();
  const { addToast } = useToaster();
  const { isAuthenticated } = storeToRefs(userStore);

  const onGetApiTokenClick = async () => {
    const { data } = await request(`/api/user/api-token`, {
      headers: {
        Authorization: userStore.authToken,
      }
    });

    await navigator.clipboard.writeText(data?.apiToken);
    addToast({
      message: 'API Token copied to clipboard.',
      type: 'success',
    });
  }
</script>

<style scoped>
  nav {
    background-color: var(--zinc-100);
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

      .authenticated-block {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4rem;
      }

      .links {
        display: flex;
        column-gap: 1rem;
        font-size: 1.15rem;
      }
    }
  }
</style>
