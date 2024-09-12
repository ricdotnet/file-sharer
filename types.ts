export interface File {
  filename: string;
  size: number;
  created: Date;
  canDelete: boolean;
  original_filename: string;
}

export interface Target extends EventTarget {
  style: string;
  files: FileList;
}