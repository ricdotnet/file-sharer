interface Toast {
  message: string;
  type: 'error' | 'info' | 'success';
}

const toasts = ref<Toast[]>([]);

export function useToaster() {
  let removeTimer: ReturnType<typeof setTimeout> | null;

  const addToast = (toast: Toast) => {
    if (removeTimer) clearTimeout(removeTimer);
    removeTimer = null;

    if (toasts.value.length > 0) {
      toasts.value.pop();
      setTimeout(() => toasts.value.push(toast), 100);
    } else {
      toasts.value.push(toast);
    }

    removeTimer = setTimeout(() => removeToast(), 5000);
  }

  const removeToast = () => {
    if (toasts.value.length > 0) {
      toasts.value.pop();
    }
  }

  return { addToast, removeToast, toasts };
}
