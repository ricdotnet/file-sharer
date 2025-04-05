<template>
  <template v-if="loadingFile">
    Loading ....
  </template>
  <template v-else>
    <span v-if="!isImage && !isVideo">
      Could not display this file.
    </span>
    <div v-else-if="isVideo" class="video-container">
      <video :src="`/api/download/${file}`" autoplay controls></video>
      <Button label="Share" @click="onClickShare" />
    </div>
    <span v-else-if="isImage">
      <img :src="`/api/download/${file}`" alt="File" />
    </span>
  </template>
</template>

<script setup lang="ts">
  import { useRoute } from '#vue-router';

  const loadingFile = ref(true);
  const isImage = ref(false);
  const isVideo = ref(false);

  const { addToast } = useToaster();
  const route = useRoute();
  const { file } = route.params;

  onMounted(async () => {
    const response = await $fetch(`/api/files/${file}`);

    if (!response) {
      loadingFile.value = false;
      return;
    }

    isImage.value = response.is_image;
    isVideo.value = response.is_video;

    loadingFile.value = false;
  });

  const onClickShare = () => {
    navigator.clipboard.writeText(location.href);

    addToast({
      type: 'success',
      message: 'Link copied to clipboard',
    });
  };

  if (import.meta.server) {
    const baseUrl = process.env.NUXT_BASE_URL;

    useSeoMeta({
      title: `File Sharer - ${file}`,
      ogTitle: `File Sharer - ${file}`,
      description: 'Sharing files made simple.',
      ogDescription: 'Sharing files made simple.',
      ogImage: `https://placehold.co/600x400`,
      ogImageSecureUrl: `https://placehold.co/600x400`,
      ogVideo: `${baseUrl}/api/download/${file}`,
      ogVideoSecureUrl: `${baseUrl}/api/download/${file}`,
      // @ts-expect-error ignore
      ogVideoType: 'text/hml',
      twitterCard: 'summary_large_image',
    });
  }
</script>

<style scoped>
  .title {
    text-align: center;
    padding-block: 1.5rem;
  }

  img {
    max-width: 100%;
  }

  video {
    max-width: 100%;
    max-height: 75vh;
  }

  .video-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    width: 100%;
  }
</style>
