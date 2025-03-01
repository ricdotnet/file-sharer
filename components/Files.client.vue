<template>
  <!-- <div class="icons">
    <IconButton @click="view = 'grid'">
      <TableCellsIcon class="icon" :class="view === 'grid' ? 'active-view' : ''" />
    </IconButton>
    <div v-if="config.public.listViewEnabled">
      <IconButton @click="view = 'list'">
        <ListBulletIcon class="icon" :class="view === 'list' ? 'active-view' : ''" />
      </IconButton>
    </div>
  </div> -->
  <div class="loading" v-if="isLoading">
    <Spinner/>
  </div>
  <div v-else>
    <div class="no-files" v-if="!files.length"> You have no files stored with us.</div>
    <div v-if="view === 'grid'" class="files-container">
      <FileCard v-for="file in files" :file="file"/>
    </div>
    <div v-else>
      Table view coming soon.
    </div>
  </div>
</template>

<script setup lang="ts">
  import FileCard from '~/components/FileCard.vue';
  import Spinner from '~/components/Spinner.vue';
  import { storeToRefs, useFileStore } from '#imports';

  type View = 'grid' | 'list';

  const isLoading = ref(true);
  const view = ref<View>('grid');

  const fileStore = useFileStore();
  const { files } = storeToRefs(fileStore);

  if (import.meta.client) {
    await fileStore.fetchFiles();
    setTimeout(() => {
      isLoading.value = false;
    }, 100);
  }
</script>

<style scoped>
  .loading {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .files-container {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.25rem;
  }

  @media (max-width: 900px) {
    .files-container {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 528px) {
    .files-container {
      grid-template-columns: 1fr;
    }
  }

  .icons {
    margin-top: 1rem;
    display: flex;
    gap: 0.2rem;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
    opacity: 50%;
  }

  .active-view {
    opacity: 100%;
  }

  .no-files {
    margin-top: 2rem;
    font-size: 1.25rem;
  }
</style>
