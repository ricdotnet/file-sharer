import { defineStore } from 'pinia';
import { File } from '~/types';

export const useFileStore = defineStore('file', () => {
  const files = ref<File[]>([]);

  async function fetchFiles() {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const response = await fetch('/api/files', {
      headers: {
        Authorization: `${token}`,
      },
    });
    const data = await response.json();

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
