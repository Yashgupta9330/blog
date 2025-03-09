"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { type Blog, deleteBlog, getBlogById } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Loader2, Edit, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Navbar } from "@/components/navbar"
import { use } from "react" // Import React.use
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Demo images for blogs without images
const demoImages = [
  "/placeholder.svg?height=400&width=1200&text=Blogi",
  "/placeholder.svg?height=400&width=1200&text=Blog+Post",
  "/placeholder.svg?height=400&width=1200&text=Article",
  "/placeholder.svg?height=400&width=1200&text=Story",
  "/placeholder.svg?height=400&width=1200&text=News",
]

// This is a dynamic page that gets the ID from the URL path parameter
export default function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params)
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { user, token, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  // Get blogId from the resolved params
  const blogId = resolvedParams?.id ? Number.parseInt(resolvedParams.id) : 0

  // Get a consistent demo image based on blog ID
  const getDemoImage = (id: number) => {
    const index = id % demoImages.length
    return demoImages[index]
  }

  useEffect(() => {
    // Only fetch the blog if we have a valid blogId
    if (!blogId) {
      setError("Invalid blog ID")
      setLoading(false)
      return
    }

    const fetchBlog = async () => {
      try {
        setLoading(true)
        // If not authenticated yet but auth is still loading, we'll try without token
        // The API call will handle unauthorized responses
        const data = await getBlogById(blogId, token)
        setBlog(data)
      } catch (err) {
        console.error("Error fetching blog:", err)
        
        // Check if error is due to unauthorized access
        if (err instanceof Error && err.message.includes("unauthorized")) {
          // Only redirect if auth is done loading and we know user isn't authenticated
          if (!authLoading) {
            toast({
              title: "Authentication required",
              description: "Please login to view this blog post",
              variant: "destructive",
            })
            router.push("/login") // Redirect to login instead of home
          }
        } else {
          setError("Failed to load blog post. It may have been deleted or doesn't exist.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [blogId, token, authLoading, router, toast])

  const handleDelete = async () => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please login to delete this blog post",
        variant: "destructive",
      })
      return
    }

    try {
      setIsDeleting(true)
      await deleteBlog(blogId, token)

      toast({
        title: "Blog deleted",
        description: "Your blog post has been successfully deleted",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Failed to delete blog",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Only check if user is owner if both user and blog are available
  const isOwner = user && blog && user.username === blog.author_username

  // Show loading state while either auth or blog data is loading
  if (loading || authLoading) {
    return (
      <>
        <Navbar />
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    )
  }

  // Show error state if there was an error or no blog is found
  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error || "Blog post not found"}</p>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container max-w-4xl py-8">
        <Card className="overflow-hidden border-none shadow-none">
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
            <img
              src={blog.image_url || getDemoImage(blog.id)}
              alt={blog.title}
              className="h-full w-full object-cover"
            />
          </div>

          <CardHeader className="px-0 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Posted by {blog.author_username} on {formatDate(blog.created_at)}
                </p>
                <h1 className="text-3xl font-bold md:text-4xl">{blog.title}</h1>
              </div>

              {isOwner && (
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => router.push(`/edit/${blog.id}`)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your blog post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-0">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {blog.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CardContent>

          <CardFooter className="px-0 pt-6 border-t">
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Posts
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}