<template>
  <ClientOnly>
    <FileList/>
  </ClientOnly>
</template>

<script setup lang="ts">
import FileList from '~/components/FileList.vue';

useHead({
  title: 'Your files',
});
</script>
