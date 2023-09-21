<script setup lang="ts">
  import FileCard from "~/components/FileCard.vue";
  import Spinner from "~/components/Spinner.vue";

  const {data, pending} = await useFetch('/api/files', {
    lazy: true,
    server: false,
  });
</script>

<template>
  <div class="loading" v-if="pending">
    <Spinner/>
  </div>
  <div v-else class="files-container">
    <FileCard v-for="file in data.files" :file="file"/>
  </div>
</template>

<style scoped>
  .loading {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .files-container {
    margin-top: 2rem;
    display: flex;
    justify-items: stretch;
    gap: 1.25rem;
    flex-wrap: wrap;
  }
</style>