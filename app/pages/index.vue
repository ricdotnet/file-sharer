<template>
  <ClientOnly>
    <Files/>
  </ClientOnly>
</template>

<script setup lang="ts">
import Files from '~/components/Files.vue';

useHead({
  title: 'Your files',
});
</script>
