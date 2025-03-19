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
  <div>
    <div class="no-files" v-if="!files.length"> You have no files stored with us.</div>

    <div class="filter-wrapper">
      <Input v-if="files.length" name="filter" id="filter" v-model="filterInput" placeholder="Filter your files" />
    </div>

    <div v-if="view === 'grid'" class="files-container">
      <template v-if="showFilteredFiles">
        <FileCard v-for="file in filteredFiles" :file="file" />
      </template>
      <template v-else>
        <FileCard v-for="file in files" :file="file" />
      </template>
    </div>
    <div v-else>
      Table view coming soon.
    </div>
  </div>
</template>

<script setup lang="ts">
  import FileCard from '~/components/FileCard.vue';
  import { storeToRefs, useDebounce, useFileStore, watchEffect } from '#imports';
  import Input from '~/components/Input.vue';
  import type { IFile } from '~/types';

  type View = 'grid' | 'list';

  const view = ref<View>('grid');
  const filterInput = ref();
  const filteredFiles = ref<IFile[]>([]);
  const showFilteredFiles = ref(false);

  const fileStore = useFileStore();
  const { files } = storeToRefs(fileStore);

  const debounce = useDebounce();

  onBeforeMount(async () => {
    await fileStore.fetchFiles();
  });

  watchEffect(() => {
    const filter = filterInput.value;

    debounce(() => {
      showFilteredFiles.value = true;

      if (!filter) {
        showFilteredFiles.value = false;
        return;
      }

      filteredFiles.value = files.value
                                 .filter(({ original_filename }) => original_filename.toLowerCase()
                                                                                     .includes(filter.toLowerCase()));
    });
  });
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

  .filter-wrapper {
    margin-top: 2rem;
  }
</style>
