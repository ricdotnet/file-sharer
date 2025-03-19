<template>
  <form method="POST" @submit="onSubmit">
    <span v-if="fileToUpload" class="file-to-upload" @click="setFileToUpload(null)">
      <span>{{ fileToUpload.name }}</span>
      <span class="clear-message">click to clear</span>
    </span>

    <span v-else>
      <input class="file" ref="fileRef" id="file-select" type="file" name="file" @change="onChange" title="" />
      <label class="file-select" for="file-select" :data-selected="fileSelected">
        {{ filename }}
      </label>
    </span>

    <Button :label="isUploading ? `${progress}%` : 'Upload'" type="submit" :is-actioning="isUploading" />
  </form>
</template>

<script setup lang="ts">
  import { type Target } from '~/types';
  import { useDropdownArea, useToaster, useUserStore } from '#imports';
  import { type AxiosProgressEvent } from 'axios';
  import { MAX_FILE_SIZE } from '~/utils/constants';
  import request from '~/utils/request';

  const { authToken } = useUserStore();
  const { fileToUpload, setFileToUpload } = useDropdownArea();
  const { addToast } = useToaster();

  const filename = ref('Upload File'.toUpperCase());
  const fileSelected = ref(false);
  const file = ref<File | null>(null);
  const isUploading = ref(false);
  const progress = ref(0);

  useHead({
    title: 'Upload a File',
  });

  function onChange(event: Event) {
    const target = event.target as Target;

    if (!target.files.length) {
      return;
    }

    file.value = target.files[0] as File;

    if (file.value.size > MAX_FILE_SIZE) {
      addToast({
        message: 'The file selected is too large',
        type: 'error',
      });

      return;
    }

    filename.value = file.value.name;
    fileSelected.value = true;
  }

  async function onSubmit(event: Event) {
    event.preventDefault();
    if (!file.value && !fileToUpload.value) {
      return;
    }

    isUploading.value = true;
    const form = new FormData();

    if (file.value) {
      form.append('file', file.value, file.value.name);

      if (file.value.type.includes('image/')) {
        form.append('is_image', 'true');
      }
    } else if (fileToUpload.value) {
      form.append('file', fileToUpload.value, fileToUpload.value.name);

      if (fileToUpload.value.type.includes('image/')) {
        form.append('is_image', 'true');
      }
    }

    try {
      await request({
        url: '/api/upload',
        method: 'post',
        data: form,
        headers: {
          Authorization: authToken,
        },
        onUploadProgress: (event: AxiosProgressEvent) => {
          const percentComplete = event.loaded / (event.total ?? 0);
          progress.value = Math.round(percentComplete * 100);
        },
      });
    } catch (_) {
      addToast({
        type: 'error',
        message: 'Error while uploading file',
      });
    }

    await navigateTo('/');
  }
</script>

<style scoped>
  .file {
    position: absolute;
    opacity: 0;

    &:focus + .file-select {
      outline: 2px solid var(--air-blue);
      outline-offset: 4px;
    }
  }

  .file-select {
    display: block;
    cursor: pointer;

    width: 100%;
    text-align: center;
    border-radius: 1rem;
    padding-block: 2rem;
    margin-block: 2rem;

    transition: ease-in-out 150ms;

    &[data-selected="false"] {
      border: 0.3rem dashed var(--gun-metal);
      color: var(--text-dim);
    }

    &[data-selected="true"] {
      border: 0.3rem dashed var(--air-blue);
      color: white;
    }

    &:hover {
      border: 0.3rem dashed var(--air-blue);
    }
  }

  .file-to-upload {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    width: 100%;
    text-align: center;
    border-radius: 1rem;
    padding-block: 2rem;
    margin-block: 2rem;
    border: 0.3rem dashed var(--gun-metal);
    position: relative;

    cursor: pointer;
    user-select: none;

    transition: ease-in-out 150ms;

    &:hover {
      border: 0.3rem dashed var(--air-blue);
    }

    .clear-message {
      opacity: 0.2;
    }
  }
</style>
