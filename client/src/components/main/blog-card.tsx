import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";

import { getTimeAgo } from "@/lib/utils";

import Link from "next/link";
import { Blog } from "@/types/types";

const BlogCard = ({ blog }: { blog: Blog }) => {
  const validImageUrl = blog.image_url?.startsWith("http")
    ? blog.image_url
    : "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg";
  return (
    <Link href={`/blog/${blog.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{blog.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AspectRatio ratio={16 / 9} className="rounded-[3px]">
              <Image
                src={validImageUrl}
                alt="Image"
                className="rounded-md object-cover"
                fill
              />
            </AspectRatio>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-1.5">
            <div className="rounded-full p-1.5 font-semibold bg-secondary">
              {blog.author_username.substring(0, 2).toUpperCase()}
            </div>
            <p className="text-sm text-neutral-600">{blog.author_username}</p>
          </div>
          <p className="text-sm text-neutral-600">
            {getTimeAgo(blog.created_at)}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
