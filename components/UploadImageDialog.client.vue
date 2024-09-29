<template>
  <template v-if="isOpen">
    <div class="overlay">
      <div class="dialog">
        <div class="dialog__content">
          <h2 class="title">Preview</h2>
          <img class="image-preview" src="" ref="previewRef" :alt="fileName"/>
        </div>
        <div class="dialog__actions">
          <Button @click="uploadFile" label="Upload"/>
          <Button @click="closeDialog" label="Close"/>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useGlobalUpload } from '~/composables/useGlobalUpload';
import { useUserStore } from '~/stores/useUserStore';
import { storeToRefs } from '#imports';

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);

const { imageFile, fileName, uploadFile, resetFile } = useGlobalUpload();

const previewRef = ref<HTMLImageElement | null>(null);
const isLoadingPreview = ref(true);

defineProps<{
  isOpen: boolean;
}>();

onUpdated(() => {
  if (imageFile.value && previewRef.value && isAuthenticated.value) {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result && 'src' in previewRef.value) {
        previewRef.value.src = reader.result as string;
      }
    };

    reader.readAsDataURL(imageFile.value);
    isLoadingPreview.value = false;
  }
});

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
