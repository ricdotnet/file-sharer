<script setup lang="ts">
</script>

<template>
  <form method="POST" enctype="multipart/form-data" action="/api/upload">
    <input ref="fileRef" type="file" name="file" />
    <button type="submit">Upload</button>
  </form>
</template>

<style scoped>

</style>