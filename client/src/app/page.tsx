"use client";
import { BlogList } from "@/components/bloglist";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleSearch = () => {
      if (searchQuery.trim()) {
        router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      } else {
        router.push(`/`);
      }
    };
    handleSearch();
  }, [searchQuery, router]);

  return (
    <main className="w-full min-h-screen bg-background flex flex-col items-center">
      <Navbar />
      <div className="container py-8 flex flex-col items-center">
        <div className="flex-1 max-w-lg w-full mx-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-6 w-6 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="w-full pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-8 text-center">Latest Blog Posts</h1>
        <BlogList />
      </div>
    </main>
  );
}