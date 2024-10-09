<template>
  <h1 class="title">Viewing {{ file }}</h1>

  <img :src="`/api/download/${file}`" alt="File" />
</template>

<script setup lang="ts">
import { useRoute } from '#vue-router';

const route = useRoute();
const { file } = route.params;

useSeoMeta({
  title: 'File Sharer',
  ogTitle: 'File Sharer',
  description: 'A simple personal file-sharing website.',
  ogDescription: 'A simple personal file-sharing website.',
  ogImage: `${file}`,
  twitterCard: 'summary_large_image',
});

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
