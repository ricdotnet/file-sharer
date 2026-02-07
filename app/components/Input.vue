<template>
  <input :id="id" v-model="model" class="input" :name="name" :type="type || 'text'" :placeholder="placeholder" >
</template>

<script setup lang="ts">
  import type { InputTypeHTMLAttribute } from 'vue';

  defineProps<{
    id: string;
    name: string;
    type?: InputTypeHTMLAttribute;
    placeholder?: string;
  }>();

  const model = defineModel({
    required: true,
    type: String,
  });
</script>

<style scoped>
  .input {
    box-sizing: border-box;
    border: 1px solid var(--zinc-90);
    border-radius: 0.5rem;
    padding: 1rem 1rem;
    color: white;
    background-color: transparent;
    transition: ease-in-out 150ms;
  }
</style>
