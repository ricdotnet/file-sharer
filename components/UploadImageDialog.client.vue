<template>
  <div v-if="isOpen" class="overlay">
    <div class="dialog">
      <div class="dialog__content">
        <h2 class="title">Preview</h2>
        <img class="image-preview" src="" ref="previewRef" :alt="fileName"/>
      </div>
      <div class="dialog__actions">
        <Button @click="doUploadFile" label="Upload"/>
        <Button @click="closeDialog" label="Close"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalUpload } from '~/composables/useGlobalUpload';
import { useUserStore } from '~/stores/useUserStore';
import { storeToRefs, useRouter } from '#imports';

const config = useRuntimeConfig();

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);

const { imageFile, fileName, uploadFile, resetFile } = useGlobalUpload();

const previewRef = ref<HTMLImageElement | null>(null);
const isLoadingPreview = ref(true);

const props = defineProps<{
  isOpen: boolean;
}>();

onUpdated(() => {
  if (props.isOpen) {
    document.addEventListener('keydown', onKeydown);
  }

  if (!props.isOpen) {
    document.removeEventListener('keydown', onKeydown);
  }

  if (imageFile.value && previewRef.value && isAuthenticated.value) {
    const reader = new FileReader();
    reader.onloadend = () => {
      // biome-ignore lint/style/noNonNullAssertion: will always have a value
      if (reader.result && 'src' in previewRef.value!) {
        previewRef.value.src = reader.result as string;
      }
    };

    reader.readAsDataURL(imageFile.value);
    isLoadingPreview.value = false;
  }
});

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDialog();
  }
};

const doUploadFile = async () => {
  const storedFilename = await uploadFile();
  if (storedFilename) {
    console.log(config.public);
    navigator.clipboard.writeText(`${config.public.appUrl}/view/${storedFilename}`);
    useRouter().push(`/view/${storedFilename}`);
  }
};

const closeDialog = () => {
  resetFile();
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  max-width: 600px;
  min-width: auto;
  max-height: min(400px, 80vh);

  overflow-y: auto;

  background-color: var(--rich-black);
  padding: 1rem;
  border-radius: 5px;
}

.dialog__actions {
  margin-top: 25px;
  display: flex;
  column-gap: 5px;
}

.title {
  margin-bottom: 20px;
}

.image-preview {
  max-width: 50%;
  max-height: 50%;
  object-fit: contain;

  border-radius: 5px;
}
</style>
