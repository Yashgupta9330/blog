"use client"

import { useEffect, useState } from "react"
import { type Blog, getBlogs } from "@/lib/api"
import { BlogCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<{
    page: number
    limit: number
    total: number
    totalPages: number
  }>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get("search")
  const pageParam = searchParams.get("page")
  const currentPage = pageParam ? Number.parseInt(pageParam) : 1

  const fetchBlogs = async (page: number, search?: string) => {
    try {
      setLoading(true)
      const data = await getBlogs(page, pagination.limit, search || undefined)

      setBlogs(data.items || [])
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.total_pages,
      })
    } catch (err) {
      setError("Failed to load blogs. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs(currentPage, searchQuery || undefined)
  }, [currentPage, searchQuery])

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())

    if (searchQuery) {
      params.set("search", searchQuery)
    }

    router.push(`/?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const { page, totalPages } = pagination
    const pageNumbers = []

    pageNumbers.push(1)

    const startPage = Math.max(2, page - 1)
    const endPage = Math.min(totalPages - 1, page + 1)

    if (startPage > 2) {
      pageNumbers.push("ellipsis-start")
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push("ellipsis-end")
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => fetchBlogs(1)} className="mt-4">
          Try Again
        </Button>
      </div>
    )
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
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination className="mt-8 flex justify-center">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.page > 1) {
                        handlePageChange(pagination.page - 1)
                      }
                    }}
                    className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNumber, index) => {
                  if (pageNumber === "ellipsis-start" || pageNumber === "ellipsis-end") {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  const page = pageNumber as number
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(page)
                        }}
                        isActive={pagination.page === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.page < pagination.totalPages) {
                        handlePageChange(pagination.page + 1)
                      }
                    }}
                    className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}