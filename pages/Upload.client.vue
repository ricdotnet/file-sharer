<template>
  <form method="POST" @submit="onSubmit">
    <input class="file" ref="fileRef" id="file-select" type="file" name="file" @change="onChange" title=""/>
    <label class="file-select" for="file-select" :data-selected="fileSelected">
      {{ filename }}
    </label>

    <Button label="Upload" type="submit" :is-actioning="isUploading"/>
  </form>
</template>

<script setup lang="ts">
  import { type Target } from "~/types";

  const filename = ref('Upload File'.toUpperCase());
  const fileSelected = ref(false);
  const file = ref<File | null>(null);
  const isUploading = ref(false);

  useHead({
    title: 'Upload a File',
  });

  function onChange(event: Event) {
    const target = event.target as Target;

    if (!target.files.length) {
      return;
    }

    file.value = target.files[0] as File;
    filename.value = file.value.name;
    fileSelected.value = true;
  }

  async function onSubmit(event: Event) {
    event.preventDefault();
    if (!fileSelected.value || !file.value) {
      return;
    }

    isUploading.value = true;
    const form = new FormData();
    form.append('file', file.value, file.value.name);

    if (file.value.type.includes('image/')) {
      form.append('is_image', 'true');
    }

    await fetch('/api/upload', {
      method: 'POST',
      body: form,
      headers: {
        Authorization: `${localStorage.getItem('token')}`,
      },
    });

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
</style>
