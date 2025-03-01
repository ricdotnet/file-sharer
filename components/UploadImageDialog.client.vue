<template>
  <div v-if="isOpen" class="overlay">
    <div class="dialog">
      <div class="dialog__content">
        <img class="image-preview" src="" ref="previewRef" :alt="fileName"/>
      </div>
    </div>

    <div class="actions">
      <Button @click="doUploadFile" label="Upload" :is-actioning="isUploading"/>
      <Button @click="closeDialog" label="Close" :disabled="isUploading"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs, useCopyUrlToClipboard, useGlobalUpload, useRouter, useToaster, useUserStore } from '#imports';

  const { addToast } = useToaster();
  const userStore = useUserStore();
  const { isAuthenticated } = storeToRefs(userStore);

  const { imageFile, fileName, uploadFile, resetFile, isUploading } = useGlobalUpload();

  const previewRef = ref<HTMLImageElement | null>(null);
  const isLoadingPreview = ref(true);

  const props = defineProps<{
    isOpen: boolean;
  }>();

  // cleanup event in case it stays set
  onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown);
  });

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
    const { storedFilename } = await uploadFile();
    if (storedFilename) {
      try {
        await useCopyUrlToClipboard().copy(`/view/${storedFilename}`);
      } catch (error) {
        console.error(error);
        addToast({ message: 'Could not copy URL to clipboard.', type: 'error' });
      }
      await useRouter().push(`/view/${storedFilename}`);
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
    background-color: #000000BB;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .dialog {
    max-width: 600px;
    max-height: min(400px, 80vh);

    background-color: var(--rich-black);
    padding: 1rem;
    border-radius: 5px;
  }

  .actions {
    margin-top: 25px;
    display: flex;
    column-gap: 5px;
  }

  .image-preview {
    width: 100%;
    max-height: min(400px, 80vh);
    object-fit: cover;

    border-radius: 5px;
  }
</style>
