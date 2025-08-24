export interface IFile {
  id: number;
  uuid: string;
  filename: string;
  size: number;
  created: Date;
  canDelete: boolean;
  original_filename: string;
  is_private: boolean;
  is_image: boolean;
  is_video: boolean;
  digest: string;
}

export interface Target extends EventTarget {
  style: string;
  files: FileList;
}
