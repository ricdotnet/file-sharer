<template>
  <div>
    <button :label="label" class="button">{{ label }}</button>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    label: string;
  }>();
</script>

<style scoped>
  .button {
    border: 1px solid var(--gun-metal);
    padding: 1rem 2rem;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: ease-in-out 150ms;

    &:focus-visible {
      outline: 2px solid var(--air-blue);
    }

    &:hover {
      border: 1px solid var(--air-blue);
    }
  }
</style>
