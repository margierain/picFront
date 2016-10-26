export interface ImageFields {
  id: number;
  image: string;
  effects: any;
  edited_image?: string;
  date_created: string;
  date_modified: string;
  uploader: number;
  folder?: string;
}