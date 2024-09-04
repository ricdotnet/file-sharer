<script setup lang="ts">
  import FileCard from "~/components/FileCard.vue";
  import Spinner from "~/components/Spinner.vue";
  
  const files = ref<{ files: File[] }>({ files: [] });
  const isLoading = ref(true);
  
  onMounted(async () => {
    const {data} = await useFetch<{ files: File[] }>('/api/files', {
      lazy: false,
      headers: {
        Authorisation: localStorage.getItem('auth-key') ?? '',
      },
    });
    
    isLoading.value = false;
    files.value = data.value || { files: [] };
  });
</script>

<template>
  <div class="loading" v-if="isLoading">
    <Spinner/>
  </div>
  <div v-else class="files-container">
    <FileCard v-for="file in files.files" :file="file"/>
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