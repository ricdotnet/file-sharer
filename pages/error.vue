<script setup lang="ts">

</script>

<template>
  <div class="error-message">
    <span>{OOPS}</span>
    <span>Something went wrong when uploading.</span>
  </div>
</template>

<style scoped>
  .error-message {
    width: 100%;
    text-align: center;
    color: var(--text-dim);
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
  }
</style>
