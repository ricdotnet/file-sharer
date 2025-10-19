<template>
  <template v-if="loadingFile"> Loading .... </template>
  <div v-else class="content">
    <span v-if="!isImage && !isVideo"> Could not display this file. </span>
    <div v-else-if="isVideo" class="video-container">
      <video
        :src="`/media/${filenameSrc}`"
        preload="metadata"
        :poster="poster"
        controls
      ></video>
    </div>
    <div v-else-if="isImage">
      <img :src="`/api/download/${filenameSrc}`" alt="File" />
    </div>
    <div v-if="isImage || isVideo">
      <Button label="Share" @click="onClickShare" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from '#vue-router';
import { useRequestHeaders } from '#app/composables/ssr';

const loadingFile = ref(true);
const isImage = ref(false);
const isVideo = ref(false);
const filenameSrc = ref('');
const poster = ref('');

const { addToast } = useToaster();
const route = useRoute();
const { file } = route.params;

onMounted(async () => {
  let response;

  try {
    response = await $fetch(`/api/files/${file}`);
  } catch (error) {
    console.log('err:', error);
    return;
  }

  if (!response) {
    loadingFile.value = false;
    return;
  }

  isImage.value = response.is_image;
  isVideo.value = response.is_video;
  filenameSrc.value = response.filename;
  poster.value = `/media/t/${response.thumbnail}`;

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

  try {
    const response = await $fetch(`/api/files/${file}`, {
      headers: useRequestHeaders(),
    });

    const seoMeta = {
      title: `File Sharer`,
      ogTitle: `File Sharer`,
      description: response.original_filename,
      ogDescription: response.original_filename,
    };

    if (response.is_video) {
      useSeoMeta({
        ...seoMeta,
        ogImage: `${baseUrl}/media/t/${response.thumbnail}`,
        ogVideo: `${baseUrl}/media/${response.filename}`,
        ogVideoType: 'video/mp4',
        ogType: 'video.other',
        twitterCard: 'player',
      });

      useHead({
        link: [
          {
            rel: 'alternate',
            type: 'application/json+oembed',
            href: `${baseUrl}/media/oembed/${file}`,
          },
        ],
      });
    } else if (response.is_image) {
      useSeoMeta({
        ...seoMeta,
        ogImage: `${baseUrl}/api/download/${response.filename}`,
        twitterCard: 'summary_large_image',
      });
    }
  } catch (error) {
    console.log('err:', error);
  }
}
</script>

<style scoped>
img {
  max-width: 100%;
}

video {
  max-width: 100%;
  max-height: 75vh;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  text-align: center;
  padding-block: 1.5rem;
}

.video-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  width: 100%;
}
</style>
