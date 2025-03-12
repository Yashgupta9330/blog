import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import BlogCard from "./main/blog-card";
import { getBlogs } from "@/api/blog";
import { Blog } from "@/types/types";

export function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  const fetchBlogs = async (page = 1, search?: string) => {
    try {
      setLoading(true);
      const { success, data } = await getBlogs(page, 10, search || undefined);
      if (success) {
        setBlogs(data.items || []);
        setCurrentPage(data.page);
        setTotalPages(data.pages);
      } else {
        setError("Failed to load blogs. Please try again later.");
      }
    } catch (err) {
      setError("Failed to load blogs. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, searchQuery || undefined);
  }, [currentPage, searchQuery]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => fetchBlogs(currentPage)} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="px-8 space-y-8">
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">No posts found</h2>
          <p className="text-muted-foreground">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search term.`
              : "Be the first to create a blog post!"}
          </p>
        </div>
      ) : (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <BlogCard blog={blog} key={index} />
            ))}
          </div>
          <div className="flex justify-center mt-8 space-x-4">
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
          <p className="text-center mt-4">
            Page {currentPage} of {totalPages}
          </p>
        </>
      )}
    </div>
  );
}