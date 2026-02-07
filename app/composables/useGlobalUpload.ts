import { ref } from 'vue';

import assert from 'node:assert';

import { request, useUserStore } from '#imports';

const imageType = ref('');
const imageFile = ref<any>();
const fileName = ref('');
const isPreviewing = ref(false);
const isUploading = ref(false);

export const useGlobalUpload = () => {
  const isMetaKeyPressed = ref(false);
  const { authToken } = useUserStore();

  const registerKeyEvents = () => {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
  };

  const removeKeyEvents = () => {
    window.removeEventListener('keydown', keyDownHandler);
    window.removeEventListener('keyup', keyUpHandler);
  };

  const keyDownHandler = async (e: any) => {
    if (!isMetaKeyPressed.value && (e.key === 'Meta' || e.key === 'Control')) {
      isMetaKeyPressed.value = true;
    }
    if (isMetaKeyPressed && e.key === 'v') {
      try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const types = item.types.filter(t => t.includes('image/'));
          if (types.length === 0) {
            continue;
          }

          assert(types[0]);
          const blob = await item.getType(types[0]);

          imageType.value = types[0].split('/')[1] as 'png' | 'jpeg' | 'webp';
          imageFile.value = blob;
          fileName.value = `clipboard.${imageType.value}`;

          isPreviewing.value = true;
        }
      } catch {
        // silently catch any error
      }
    }
  };

  const keyUpHandler = (e: any) => {
    if (isMetaKeyPressed.value && (e.key === 'Meta' || e.key === 'Control')) {
      isMetaKeyPressed.value = false;
    }
  };

  const resetFile = () => {
    imageFile.value = undefined;
    imageType.value = '';
    isPreviewing.value = false;
  };

  const uploadFile = async () => {
    isUploading.value = true;
    const filename = `${Date.now()}.${imageType.value}`;

    const form = new FormData();
    form.append('file', imageFile.value, filename);
    form.append('is_image', 'true');
    form.append('is_private', 'false');

    const response = await request({
      url: '/api/upload',
      method: 'POST',
      data: form,
      headers: { Authorization: authToken! },
    });

    resetFile();

    const storedFilename = await response.data;
    isUploading.value = false;

    return { storedFilename };
  };

  return {
    registerKeyEvents,
    fileName,
    imageFile,
    imageType,
    isUploading,
    resetFile,
    uploadFile,
    removeKeyEvents,
    isPreviewing,
  };
};
