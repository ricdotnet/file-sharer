import { ref } from '#imports';

const fileToUpload = ref<File | null>(null);

export function useDropdownArea() {
  const dropdownArea = ref<HTMLDivElement | null>(null);

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();

    dropdownArea.value!.classList.add('show');
  };

  const onDragLeave = () => {
    dropdownArea.value!.classList.remove('show');
  };

  const onDrop = async (e: DragEvent) => {
    e.preventDefault();

    const file = e.dataTransfer?.files[0];

    if (!file) {
      return;
    }

    setFileToUpload(file);
    dropdownArea.value!.classList.remove('show');

    await navigateTo('/upload');
  };

  const registerDropdownAreaEvents = () => {
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('dragleave', onDragLeave);
    document.addEventListener('drop', onDrop);
  };

  const removeDropdownAreaEvents = () => {
    document.removeEventListener('dragover', onDragOver);
    document.removeEventListener('dragleave', onDragLeave);
    document.removeEventListener('drop', onDrop);
  };

  const setFileToUpload = (file: File | null) => {
    fileToUpload.value = file;
  };

  return { dropdownArea, fileToUpload, setFileToUpload, registerDropdownAreaEvents, removeDropdownAreaEvents };
}
