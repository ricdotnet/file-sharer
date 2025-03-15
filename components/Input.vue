<template>
  <input class="input" :id="id" :name="name" :type="type || 'text'" :placeholder="placeholder" v-model="model" />
</template>

<script setup lang="ts">
  import type { InputTypeHTMLAttribute } from '@vue/runtime-dom';

  defineProps<{
    id: string;
    name: string;
    type?: InputTypeHTMLAttribute;
    placeholder?: string;
  }>();

  const model = defineModel();
</script>

<style scoped>
  .input {
    box-sizing: border-box;
    border: 1px solid var(--gun-metal);
    border-radius: 0.5rem;
    padding: 1rem 1rem;
    color: white;
    background-color: transparent;
    transition: ease-in-out 150ms;
  }
</style>