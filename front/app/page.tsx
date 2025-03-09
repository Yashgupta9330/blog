import { BlogList } from "@/components/blog-list"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="text-4xl font-bold px-8 mb-8">Latest Blog Posts</h1>
        <BlogList />
      </div>
    </main>
  )
}

