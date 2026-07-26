import { S3 } from '@aws-sdk/client-s3';

import { FileType } from '~~/common/fileType';

function createS3Client() {
  return new S3({
    region: process.env.AWS_REGION!,
    endpoint: process.env.AWS_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
  });
}

export const s3Client = createS3Client();

export function buildObjectKey(fileType: FileType, fileId: string) {
  switch (fileType) {
    case FileType.VIDEO:
      return `VIDEO/${fileId}`;
    case FileType.IMAGE:
      return `IMAGE/${fileId}`;
    case FileType.AUDIO:
      return `IMAGE/${fileId}`;
    case FileType.THUMBNAIL:
      return `THUMBNAIL/${fileId}`;
    default:
      return `OTHER/${fileId}`;
  }
}
