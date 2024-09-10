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
    background-color: var(--air-blue);
    border: none;
    cursor: pointer;
    display: inline-flex;
    padding-block: 0.5rem;
    padding-inline: 1rem;
    outline: none;
    border-radius: 0.4rem;

    &:focus-visible {
      outline: 2px solid var(--air-blue);
    }

    &:active {
      opacity: 0.8;
    }
  }
</style>
