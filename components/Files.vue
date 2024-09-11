<template>
  <div class="icons">
    <IconButton @click="view = 'grid'">
      <TableCellsIcon class="icon" :class="view === 'grid' ? 'active-view' : ''" />
    </IconButton>
    <template v-if="config.public.listViewEnabled">
      <IconButton @click="view = 'list'">
        <ListBulletIcon class="icon" :class="view === 'list' ? 'active-view' : ''" />
      </IconButton>
    </template>
  </div>
  <div class="loading" v-if="isLoading">
    <Spinner />
  </div>
  <div v-else>
    <div v-if="view === 'grid'" class="files-container">
      <FileCard v-for="file in files.files" :file="file" />
    </div>
    <div v-else>
      Table view coming soon.
    </div>
  </div>
</template>

<script setup lang="ts">
  import FileCard from "~/components/FileCard.vue";
  import Spinner from "~/components/Spinner.vue";
  import { File } from "~/types";
  import { ListBulletIcon, TableCellsIcon } from '@heroicons/vue/16/solid';
  import IconButton from '~/components/IconButton.vue';

  const config = useRuntimeConfig();

  type View = 'grid' | 'list';

  const files = ref<{ files: File[] }>({ files: [] });
  const isLoading = ref(true);
  const view = ref<View>('grid');

  onMounted(() => {
    isLoading.value = false;
    files.value = {
      files: [
        {
          filename: 'file1.txt',
          size: 1000,
          created: new Date(),
          canDelete: true,
        },
        {
          filename: 'file2.txt',
          size: 2000,
          created: new Date(),
          canDelete: false,
        },
        {
          filename: 'file3.txt',
          size: 3000,
          created: new Date(),
          canDelete: true,
        },
      ]
    };
  });

  // onMounted(async () => {
  //   const { data } = await useFetch<{ files: File[] }>('/api/files', {
  //     lazy: true,
  //     headers: {
  //       Authorisation: localStorage.getItem('auth-key') ?? '',
  //     },
  //   });
  //
  //   isLoading.value = false;
  //   files.value = data.value || { files: [] };
  // });
</script>

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
</style>
