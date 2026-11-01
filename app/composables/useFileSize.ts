export function useFileSize() {
  const convertToHumanReadable = (size: number) => {
    let _size: number;
    let _unit: 'b' | 'KB' | 'MB';

    if (size < 1000) {
      _size = size;
      _unit = 'b';
    } else if (size < 1000000) {
      _size = size / 1000;
      _unit = 'KB';
    } else {
      _size = size / 1000000;
      _unit = 'MB';
    }

    return `${_size.toFixed(2)} ${_unit}`;
  };

  return {
    convertToHumanReadable,
  };
}
