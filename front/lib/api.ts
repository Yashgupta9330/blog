// API service for blog-related operations

export type Blog = {
  id: number
  title: string
  content: string
  image_url?: string
  user_id: number
  author_username: string
  created_at: string
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

const API_BASE_URL = "http://localhost:8000/api"

// Get all blogs with optional pagination and search
export async function getBlogs(page = 1, limit = 10, search?: string): Promise<any> {
  let url = `${API_BASE_URL}/blogs/?page=${page}&limit=${limit}`
  if (search) {
    url += `&search=${encodeURIComponent(search)}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch blogs")
  }

  return response.json()
}

// Get a single blog by ID
export async function getBlogById(id: number,token:string): Promise<Blog> {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`,{
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch blog")
  }

  return response.json()
}

// Create a new blog
export async function createBlog(blog: CreateBlogInput, token: string): Promise<Blog> {
  const response = await fetch(`${API_BASE_URL}/blogs/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(blog),
  })

  if (!response.ok) {
    throw new Error("Failed to create blog")
  }

  return response.json()
}

// Update an existing blog
export async function updateBlog(id: number, blog: CreateBlogInput, token: string): Promise<Blog> {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(blog),
  })

  if (!response.ok) {
    throw new Error("Failed to update blog")
  }

  return response.json()
}

// Delete a blog
export async function deleteBlog(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete blog")
  }
}

// Get a presigned URL for image upload
export async function getPresignedUrl(
  fileName: string,
  fileType: string,
  token: string,
): Promise<PresignedUrlResponse> {
  const response = await fetch(`${API_BASE_URL}/uploads/presigned-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ file_name: fileName, file_type: fileType }),
  })

  if (!response.ok) {
    throw new Error("Failed to get presigned URL")
  }

  return response.json()
}

// Upload a file to the presigned URL
export async function uploadToPresignedUrl(presignedUrl: string, file: File): Promise<void> {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "image/jpg"
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file. Status: ${response.status}`);
  }
}


