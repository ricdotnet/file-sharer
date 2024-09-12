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

  return { files, fetchFiles };
});
