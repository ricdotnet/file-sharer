import { defineStore } from 'pinia';

import { useUserStore } from '#imports';
import type { IFile } from '~~/types';

export const useFileStore = defineStore('file', () => {
  const files = ref<IFile[]>([]);
  const userStore = useUserStore();
  const isMediaFilter = ref(false);

  async function fetchFiles() {
    if (!userStore.authToken) {
      return;
    }

    const { data } = await request({
      url: '/api/files',
      headers: { Authorization: userStore.authToken },
    });

    files.value = data.files;
  }

  function removeFile(id: number) {
    files.value = files.value.filter((file) => file.id !== id);
  }

  function updatePrivacy(id: number) {
    files.value = files.value.map((file) => {
      if (file.id !== id) {
        return file;
      }
      return {
        ...file,
        is_private: !file.is_private,
      };
    });
  }

  function filteredFiles(filter?: string) {
    const filtered = files.value.filter((file) => {
      if (!isMediaFilter.value) { return !file.is_video && !file.is_image; }
      return file.is_image || file.is_video;
    });

    if (!filter || filter.length === 0) {
      return filtered;
    }

    return filtered.filter((file) => file.original_filename.includes(filter));
  }

  function updateMediaFilter() {
    isMediaFilter.value = !isMediaFilter.value;
  }

  return { filteredFiles, fetchFiles, removeFile, updateMediaFilter, updatePrivacy };
});
