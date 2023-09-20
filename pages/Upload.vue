<script setup lang="ts">
  const fileRef = ref<HTMLInputElement | null>(null);

  onMounted(() => {
    fileRef.value?.addEventListener('change', (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      for (const file in files) {

      }
    });
  });


  // let tmp: File[] = [];
  // for ( let i = 0; i < fileList.length; i++ ) {
  //   if ( i === 5 ) break;
  //
  //   if ( !fileList[i].type.includes('image/') ) {
  //     const toast: ToastInterface = {
  //       id: Date.now(),
  //       content: 'Please select only images.',
  //       type: 'warning',
  //     };
  //     toastEventChannel.dispatch('onAddToast', toast);
  //     break;
  //   }
  //
  //   if ( !files.find(f => f.name === fileList[i].name) ) {
  //     tmp.push(fileList[i]);
  //   }
  // }
  // tmp = [...files, ...tmp];
</script>

<template>
  <form method="POST" enctype="multipart/form-data" action="/api/upload">
    <input ref="fileRef" type="file" name="file" />
    <button type="submit">Upload</button>
  </form>
</template>

<style scoped>

</style>