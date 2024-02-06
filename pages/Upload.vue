<script setup lang="ts">
  import {onMounted} from "@vue/runtime-core";
  import {Target} from "~/types";

  const filename = ref('Upload File'.toUpperCase());
  const fileSelected = ref<boolean>(false);
  const keyRef = ref<HTMLInputElement>();

  onMounted(() => {
    if (keyRef.value) {
      keyRef.value.value = localStorage.getItem('auth-key') || '';
    }
  });

  useHead({
    title: 'Upload a File',
  });

  definePageMeta({
    middleware: 'upload-auth'
  });

  function onChange(event: Event) {
    const target = event.target as Target;

    if (!target.files.length) {
      return;
    }

    const file = target.files[0];
    filename.value = file.name;
    fileSelected.value = true;
  }

  function onSubmit(event: Event) {
    if (!fileSelected.value) {
      event.preventDefault();
    }
  }
</script>

<template>
  <form method="POST" enctype="multipart/form-data" action="/api/upload" @submit="onSubmit">
    <input class="file" ref="fileRef" id="file-select" type="file" name="file" @change="onChange" title=""/>
    <label class="file-select" for="file-select" :data-selected="fileSelected">
      {{ filename }}
    </label>

    <input type="hidden" ref="keyRef" name="auth-key" />

    <button class="button" type="submit">Upload</button>
  </form>
</template>

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

  .button {
    border: 1px solid var(--gun-metal);
    padding: 1rem 2rem;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: ease-in-out 150ms;

    &:hover {
      border: 1px solid var(--air-blue);
    }
  }
</style>