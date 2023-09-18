<script setup lang="ts">
  const { data, pending } = await useFetch('/api/files', {
    lazy: true,
    server: false,
  });
</script>

<template>
  <div v-if="pending">
    Loading files...
  </div>
  <div v-else class="files-container">
    <FileCard v-for="file in data.files" :file="file"/>
  </div>
</template>

<style scoped>
  .files-container {
    margin-top: 2rem;
    display: flex;
    justify-items: stretch;
    gap: 1.25rem;
  }
</style>