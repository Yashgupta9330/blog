import { PresignedUrlResponse } from "@/types/types";

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  export async function getPresignedUrl(
    fileName: string,
    fileType: string,
    token: string,
  ): Promise<PresignedUrlResponse> {
    const response = await fetch(`${API_BASE_URL}/api/uploads/presigned-url`, {
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
  