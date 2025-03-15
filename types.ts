export interface IFile {
  id: number;
  filename: string;
  size: number;
  created: Date;
  canDelete: boolean;
  original_filename: string;
  is_private: boolean;
}

export interface Target extends EventTarget {
  style: string;
  files: FileList;
}
