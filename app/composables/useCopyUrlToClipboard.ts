export const useCopyUrlToClipboard = () => {
  const baseUrl = window.location.href.slice(0, -1);

  const copy = async (path: string) => {
    const url = `${baseUrl}${path}`;
    await navigator.clipboard.writeText(url);
  };

  return { copy };
}
