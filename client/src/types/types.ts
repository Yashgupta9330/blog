export interface Blog {
  id: string;
  title: string;
  image_url?: string;
  content: string;
  user_id: string;
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
