<script setup lang="ts">
  const files = [
    {
      filename: 'hello_world.zip',
      size: 2133212,
    },
    {
      filename: 'Song Of My People.mp3',
      size: 5443133,
    }
  ];
</script>

<template>
  <div>
    <div v-for="file in files">
      {{ file.filename }} :: {{ file.size / 1000000 }}
    </div>
  </div>
</template>

<style scoped>

</style>