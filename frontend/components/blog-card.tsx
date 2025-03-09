import Link from "next/link"
import type { Blog } from "@/lib/api"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

interface BlogCardProps {
  blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blog/${blog.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        {blog.image_url && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={blog.image_url || "/placeholder.svg"}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <h3 className="text-xl font-semibold line-clamp-2">{blog.title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{blog.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <span>By {blog.author_username}</span>
          <span>{formatDate(blog.created_at)}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}

