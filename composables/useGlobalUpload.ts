import { ref } from 'vue';

const imageType = ref('');
const imageFile = ref<any>();
const fileName = ref('');
const isUploading = ref(false);

export const useGlobalUpload = () => {
  const isMetaKeyPressed = ref(false);

  const registerKeyEvents = () => {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
  }

  const keyDownHandler = async (e: any) => {
    if (!isMetaKeyPressed.value && (e.key === 'Meta' || e.key === 'Control')) {
      isMetaKeyPressed.value = true;
    }
    if (isMetaKeyPressed && e.key === 'v') {
      try {
        const items = await navigator.clipboard.read();
        for (let item of items) {
          const types = item.types.filter(t => t.includes('image/'));
          const blob = await item.getType(types[0]);

          imageType.value = types[0].split('/')[1];
          imageFile.value = blob;
          fileName.value = `clipboard.${imageType.value}`;

          isUploading.value = true;
        }
      } catch (err) {
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
    isUploading.value = false;
  }

  const uploadFile = async () => {
    const form = new FormData();
    form.append('file', imageFile.value, Date.now() + '.' + imageType.value);
    form.append('is_image', 'true');
    form.append('is_private', 'false');

    await fetch('/api/upload', {
      method: 'POST',
      body: form,
      headers: {
        Authorization: `${localStorage.getItem('token')}`,
      },
    });

    resetFile();
    window.location.reload();
  }

  return { registerKeyEvents, fileName, imageFile, imageType, isUploading, resetFile, uploadFile };
};
