<script setup lang="ts">
  defineProps<{
    file: string;
  }>();
</script>

<template>
  <div class="file">
    {{ file }}
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