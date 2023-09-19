<script setup lang="ts">
  const fileRef = ref<HTMLInputElement | null>(null);

  onMounted(() => {
    fileRef.value?.addEventListener('change', (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      console.log(files);
    });
  })
</script>

<template>
  <form method="POST" enctype="multipart/form-data">
    <input ref="fileRef" type="file" />
  </form>
</template>

<style scoped>

</style>