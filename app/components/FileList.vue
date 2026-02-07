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
    <div v-if="!filteredFiles().length" class="no-files"> You have no files stored with us.</div>

    <div class="filter-wrapper">
      <Input
        v-if="filteredFiles().length"
        id="filter"
        v-model="filterInput"
        name="filter"
        placeholder="Filter your files"
      />
    </div>

    <div v-if="view === 'grid'" class="files-container">
      <FileCard v-for="file in filteredFiles(filter)" :key="file.id" :file="file"/>
    </div>
    <div v-else>
      List view coming soon!
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounce, useFileStore, watch } from '#imports';
import FileCard from '~/components/FileCard.vue';
import Input from '~/components/Input.vue';

type View = 'grid' | 'list';

const view = ref<View>('grid');
const filterInput = ref();
const filter = ref('');

const { filteredFiles, fetchFiles } = useFileStore();

const debounce = useDebounce();

onBeforeMount(async () => {
  await fetchFiles();
});

watch(filterInput, () => {
  debounce(() => {
    filter.value = filterInput.value;
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
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .files-container {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .files-container {
    grid-template-columns: 1fr 1fr 1fr;
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
