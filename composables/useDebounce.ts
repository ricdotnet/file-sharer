export function useDebounce() {
  let timer: NodeJS.Timeout | undefined;

  return (func: (...args: unknown[]) => void, delay = 500) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(func, delay);
  };
}
