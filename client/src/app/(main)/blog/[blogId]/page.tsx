"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { getBlogById } from "@/api/blog";
import { Blog } from "@/types/types";


const BlogPage = () => {
  const { blogId } = useParams();
  const [loading, setLoading] = useState(!!blogId);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const validImageUrl = blog?.image_url?.startsWith("http")
    ? blog.image_url
    : "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg";

  useEffect(() => {
    if (!blogId) {
      console.error("Invalid blog ID:", blogId);
      setError("Invalid blog ID");
      setLoading(false);
      return;
    }

    if (!token && !authLoading) {
      router.push("/signin");
      toast({
        title: "Authentication required",
        description: "Please login to view this blog post",
        variant: "destructive",
      });
      return;
    }

    const fetchBlog = async () => {
      try {
        setLoading(true);
        console.log("Fetching blog with ID:", blogId);
        console.log("Auth token available:", !!token);
        const data = await getBlogById(Number(blogId));
        console.log("Blog data received:", data);
        setBlog(data.data);
      } catch (err) {
        console.error("Error fetching blog:", err);

        if (err instanceof Error && err.message.includes("unauthorized")) {
          console.log("Unauthorized access, auth loading:", authLoading);
          if (!authLoading) {
            toast({
              title: "Authentication required",
              description: "Please login to view this blog post",
              variant: "destructive",
            });
            console.log("Redirecting to login due to unauthorized access");
            router.push("/login");
          }
        } else {
          setError("Failed to load blog post. It may have been deleted or doesn't exist.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, token, authLoading, router, toast]);

  if (loading || authLoading) {
    return (
      <div className="container py-20 flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading blog with ID: {blogId}</p>
        {authLoading && <p>Authentication is also loading...</p>}
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error || "Blog post not found"}</p>
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <Link href={"/"}>
        <Button variant="outline">
          <ArrowLeft size={24} />
        </Button>
      </Link>
      <Card className="overflow-hidden border-none shadow-none">
        <div className="relative w-full h-96 mb-6">
          <Image src={validImageUrl} alt={blog.title} layout="fill" className="object-cover rounded-lg shadow-md" />
        </div>

        <CardHeader className="px-0 pt-0">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Posted by {blog.author_username} on {formatDate(blog.created_at)}
            </p>
            <CardTitle className="text-3xl font-bold md:text-4xl">{blog.title}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
        </CardContent>

        <CardFooter className="px-0 pt-6 border-t">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Posts
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogPage;