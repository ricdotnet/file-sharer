<script setup lang="ts">
  import {File} from "~/types";

  defineProps<{
    file: File;
  }>();
</script>

<template>
  <div class="file">
    <div>{{ file.filename }}</div>
    <div>Size: {{ file.size }}</div>
    <div>Uploaded: {{ file.created }}</div>
  </div>
</template>

<style scoped>
  .file {
    height: auto;
    padding: 2rem 2.5rem;
    border: 1px solid var(--gun-metal);
    flex-grow: 1;
    flex-shrink: 1;
    border-radius: 1.1rem;

    box-shadow: 0.2rem 0.2rem 0.5rem rgba(0, 0, 0, .5);
  }
</style>