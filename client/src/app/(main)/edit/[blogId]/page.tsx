"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getBlogById, updateBlogById } from "@/api/blog";
import { getPresignedUrl, uploadToPresignedUrl } from "@/api/upload";

export default function EditBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>();
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const { blogId } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    if (!token && !isLoading) {
      router.push("/signin");
      return;
    }

    if (!blogId) {
      router.push("/");
      return;
    }

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data } = await getBlogById(Number(blogId));
        if (user && user.username !== data.author_username) {
          setError("You don't have permission to edit this blog post");
          return;
        }

        setTitle(data.title);
        setContent(data.content);
        setCurrentImageUrl(data.image_url);
        setImagePreview(data.image_url || null);
      } catch (err) {
        setError("Failed to load blog post. It may have been deleted or doesn't exist.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, user, token, isLoading, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

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

      let imageUrl = currentImageUrl;

      if (file) {
        setIsUploading(true);

        const presignedData = await getPresignedUrl(file.name, file.type, token);

        await uploadToPresignedUrl(presignedData.upload_url, file);

        imageUrl = presignedData.file_url;
        setIsUploading(false);
      }

      await updateBlogById(Number(blogId), {
        title,
        content,
        imageUrl: imageUrl,
      });

      toast({
        title: "Success!",
        description: "Your blog post has been updated",
      });

      router.push(`/blog/${blogId}`);
    } catch (error) {
      toast({
        title: "Failed to update post",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Blog Post</CardTitle>
          <CardDescription>Update your blog post</CardDescription>
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
                  {currentImageUrl ? "Change Image" : "Add Image"}
                </Button>
                <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {file && <span className="text-sm text-muted-foreground">{file.name}</span>}
              </div>

              {imagePreview && (
                <div className="mt-4 aspect-video w-full max-w-md overflow-hidden rounded-md border">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/blog/${blogId}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading Image..." : isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}