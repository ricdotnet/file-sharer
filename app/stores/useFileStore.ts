import { defineStore } from 'pinia';

import { useUserStore } from '#imports';
import type { IFile } from '~~/types';

export const useFileStore = defineStore('file', () => {
  const files = ref<IFile[]>([]);
  const userStore = useUserStore();

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
    if (!filter || filter.length === 0) {
      return files.value;
    }

    return files.value.filter((file) => file.original_filename.includes(filter));
  }

  return { filteredFiles, fetchFiles, removeFile, updatePrivacy };
});
