import { defineStore } from 'pinia';
import type { IFile } from '~/types';
import { useUserStore } from '#imports';

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

  return { files, fetchFiles, removeFile, updatePrivacy };
});
