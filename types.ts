export interface File {
  filename: string;
  size: number;
  created: Date;
  canDelete: boolean;
}

export interface Target extends EventTarget {
  style: string;
  files: FileList;
}