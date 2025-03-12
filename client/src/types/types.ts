export interface Blog {
  id: number;
  title: string;
  image_url?: string;
  content: string;
  user_id: number;
  created_at: string;
  author_username: string;
  updated_at: string
}

export type CreateBlogInput = {
  title: string
  content: string
  image_url?: string
}

export type PresignedUrlResponse = {
  upload_url: string
  file_url: string
}
