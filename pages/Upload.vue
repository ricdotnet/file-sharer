<template>
  <form method="POST" enctype="multipart/form-data" action="/api/upload" @submit="onSubmit">
    <input class="file" ref="fileRef" id="file-select" type="file" name="file" @change="onChange" title="" />
    <label class="file-select" for="file-select" :data-selected="fileSelected">
      {{ filename }}
    </label>

    <input type="hidden" ref="keyRef" name="auth-key" />

     <Button label="Upload" type="submit" />
  </form>
</template>

<script setup lang="ts">
  import { onMounted } from "@vue/runtime-core";
  import { Target } from "~/types";

  const filename = ref('Upload File'.toUpperCase());
  const fileSelected = ref<boolean>(false);
  const keyRef = ref<HTMLInputElement>();

  // onMounted(() => {
  //   if (keyRef.value && process.client) {
  //     keyRef.value.value = localStorage.getItem('auth-key') || '';
  //   }
  // });

  const { data } = await useFetch('/api/user/digest');
  console.log(data.value);

  useHead({
    title: 'Upload a File',
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
