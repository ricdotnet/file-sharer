<template>
  <h1 class="title">Viewing {{ file }}</h1>

  <img :src="`/api/download/${file}`" alt="File"/>
</template>

<script setup lang="ts">
  import { useRoute } from '#vue-router';

  const route = useRoute();
  const { file } = route.params;

  const appUrl = ref<string>();

  if (import.meta.server) {
    appUrl.value = process.env.VITE_APP_URL;

    useSeoMeta({
      title: `File Sharer - ${file}`,
      ogTitle: `File Sharer - ${file}`,
      description: 'Sharing files made simple.',
      ogDescription: 'Sharing files made simple.',
      ogImage: `${appUrl.value}/api/download/${file}`,
      twitterCard: 'summary_large_image',
    });
  }
</script>

<style scoped>
  .title {
    text-align: center;
    padding-block: 1.5rem;
  }

  img {
    max-width: 100%;
  }
</style>
