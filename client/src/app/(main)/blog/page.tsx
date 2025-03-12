"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

import { createBlog } from "@/api/blog";
import { getPresignedUrl, uploadToPresignedUrl } from "@/api/upload";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!token || !user) {
      router.push("/signin");
    }
  }, [token, user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "Authentication error",
        description: "Please log in again",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrl = "";

      // Upload image if selected
      if (file) {
        setIsUploading(true);

        // Get presigned URL
        const presignedData = await getPresignedUrl(file.name, file.type, token);

        // Upload to S3
        await uploadToPresignedUrl(presignedData.upload_url, file);

        imageUrl = presignedData.file_url;
        setIsUploading(false);
      }

      // Create blog post
      const response = await createBlog(title, imageUrl, content);

      if (response.success) {
        toast({
          title: "Success!",
          description: "Your blog post has been published",
        });

        router.push("/");
      } else {
        throw new Error(response.data);
      }
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
          <CardDescription>Share your thoughts with the world</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a catchy title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your blog post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Cover Image (Optional)</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image")?.click()}
                  className="cursor-pointer"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
                <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {file && <span className="text-sm text-muted-foreground">{file.name}</span>}
              </div>

              {imagePreview && (
                <div className="mt-4 aspect-video w-full max-w-md overflow-hidden rounded-md border">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading Image..." : isSubmitting ? "Publishing..." : "Publish Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}