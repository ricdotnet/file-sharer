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
    <div class="buttons-row" v-if="isImage || isVideo">
      <Button label="Share" @click="onClickShare" />
      <Button v-if="isAuthenticated && canDelete" label="Delete" @click="(e: MouseEvent) => onClickDelete(e, fileId)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from '#vue-router';
import { useRequestHeaders } from '#app/composables/ssr';
import { useUserStore } from '~/stores/useUserStore';
import { useToaster } from '~/composables/useToaster';
import { storeToRefs } from '#imports';

const loadingFile = ref(true);
const isImage = ref(false);
const isVideo = ref(false);
const filenameSrc = ref('');
const poster = ref('');
const fileId = ref(0);

const canDelete = useState<boolean>('can-delete', () => false);

const { addToast } = useToaster();
const userStore = useUserStore();
const route = useRoute();
const { file } = route.params;
const { authToken, isAuthenticated } = storeToRefs(userStore);

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

  fileId.value = response.id;
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

async function onClickDelete(event: MouseEvent, id: number) {
  event.stopPropagation();

  const confirmDelete = confirm('Are you sure you want to delete this file?');
  if (!confirmDelete) {
    return;
  }

  try {
    await request({
      url: `/api/files/${id}`,
      method: 'DELETE',
      headers: { authorization: authToken! },
    });
  } catch (_) {
    addToast({
      type: 'error',
      message: 'Error while trying to delete the file',
    });

    return;
  }

  await navigateTo('/');
}

if (import.meta.server) {
  const baseUrl = process.env.NUXT_BASE_URL;

  try {
    const response = await $fetch(`/api/files/${file}`, {
      headers: useRequestHeaders(),
    });

    canDelete.value = response.canDelete;

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

.buttons-row {
  display: flex;
  gap: 1rem;
}
</style>
