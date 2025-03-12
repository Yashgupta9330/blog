"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/main/blog-card";
import blogCardWithActions from "@/components/main/blog-card-with-actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Blog } from "@/types/types";
import { getUserBlogs } from "@/api/blog";
import PageLoader from "@/components/page-loader";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const BlogCardWithAction = blogCardWithActions(BlogCard);

const UserBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  console.log("user ", user);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user) {
      const fetchBlogs = async () => {
        const response = await getUserBlogs(user.id);
        if (response.success) {
          setBlogs(response.data.items);
        } else {
          console.error("Error fetching blogs:", response.data);
        }
        setLoading(false);
      };

      fetchBlogs();
    }
  }, [user, isLoading, router]);

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    console.log("Delete blog:", id);
  };

  return (
    <div className="flex flex-col gap-3">
      <Link href={"/"}>
        <Button variant="outline">
          <ArrowLeft size={24} />
        </Button>
      </Link>

      {loading ? (
        <PageLoader />
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <BlogCardWithAction
              key={blog.id}
              blog={blog}
              onEdit={() => handleEdit(blog.id)}
              onDelete={() => handleDelete(blog.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogs;