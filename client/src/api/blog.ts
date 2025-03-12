import { AxiosError } from "axios";
import apiClient from "./axios-config";

export const createBlog = async (
  title: string,
  image_url: string | undefined,
  content: string
) => {
  try {
    const response = await apiClient.post("/api/blogs", {
      title,
      image_url,
      content,
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      data: err.response?.data || "An error occurred",
      status: err.response?.status || 500,
    };
  }
};

export const getAllBlogs = async () => {
  try {
    const response = await apiClient.get(`/api/blogs`);

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      data: err.response?.data || "An error occurred",
      status: err.response?.status || 500,
    };
  }
};


export async function getBlogs(page = 1, limit = 10, search?: string): Promise<any> {

  let url = `/api/blogs/?page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`
  }
  try {
    const response = await apiClient.get(url)
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      data: err.response?.data || "An error occurred",
      status: err.response?.status || 500,
    };
  }
}

export const getUserBlogs = async (id: number) => {
  try {
    const response = await apiClient.get(`/api/blogs/user/${id}`);

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      data: err.response?.data || "An error occurred",
      status: err.response?.status || 500,
    };
  }
};

export const getBlogById = async (id: number) => {
  try {
    const response = await apiClient.get(`/api/blogs/${id}`);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      data: err.response?.data || "An error occurred",
      status: err.response?.status || 500,
    };
  }
};

export const updateBlogById = async (
  id: number,
  data: Partial<{
    title: string;
    imageUrl: string;
    content: string;
  }>
) => {
  try {
    const response = await apiClient.put(`/api/blogs/${id}`, data);
    return {
      success: true,
      message: "Blog updated successfully",
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      message: err.response?.data || "Failed to update blog",
      data: null,
      status: err.response?.status || 500,
    };
  }
};

export const deleteBlogById = async (id: number) => {
  try {
    const response = await apiClient.delete(`/api/blogs/${id}`);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      data: err.response?.data || "An error occurred while deleting the blog",
      status: err.response?.status || 500,
    };
  }
};
