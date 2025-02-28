<template>
  <button class="button" :disabled="isActioning">
    <Spinner v-if="isActioning" />
    {{ label }}
  </button>
</template>

<script setup lang="ts">
  defineProps<{
    label: string;
    isActioning: boolean;
  }>();
</script>

<style scoped>
  .button {
    border: 1px solid var(--gun-metal);
    padding: 1rem 2rem;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: ease-in-out 150ms;
    align-self: flex-start;

    display: flex;
    align-items: center;
    gap: 1rem;

    &:focus-visible {
      outline: 2px solid var(--air-blue);
    }

    &:hover {
      border: 1px solid var(--air-blue);
    }
  }
</style>
