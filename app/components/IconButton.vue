<template>
  <button class="button">
    <slot/>
  </button>
</template>

<script setup lang="ts">

</script>

<style scoped>
  .button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: inline-flex;
    padding: 0;
    outline: none;

    &:focus-visible {
      outline: 2px solid var(--teal-50);
    }
  }
</style>
