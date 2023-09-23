export interface File {
  filename: string;
  size: number;
  created: Date;
}

export interface Target extends EventTarget {
  style: string;
  files: FileList;
}