export enum FileType {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  OTHER = 'OTHER',
  THUMBNAIL = 'THUMBNAIL',
}

export const fileTypeFromMimeType = (mimeType: string): FileType => {
  switch (true) {
    case mimeType.startsWith('image/'):
      return FileType.IMAGE;
    case mimeType.startsWith('video/'):
      return FileType.VIDEO;
    case mimeType.startsWith('audio/'):
      return FileType.AUDIO;
    default:
      return FileType.OTHER;
  }
};
