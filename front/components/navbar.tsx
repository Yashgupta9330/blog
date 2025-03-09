"use client"

import type React from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const handleSearch = () => {
      if (searchQuery.trim()) {
        router.push(`/?search=${encodeURIComponent(searchQuery)}`)
      } else {
        router.push(`/`)
      }
    }

    handleSearch()
  }, [searchQuery, router])

  return (
    <header className="border-b w-full">
      <div className="flex items-center justify-between px-12 py-4">
        <Link href="/" className="text-2xl font-bold">
          Blogi
        </Link>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {user ? (
            <>
              <span className="text-sm hidden md:inline">{user.username}</span>
              <Button asChild variant="outline">
                <Link href="/create">New Post</Link>
              </Button>
              <Button onClick={logout} variant="ghost">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}