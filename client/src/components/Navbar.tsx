"use client"

import type React from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./toggle-theme"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b w-full">
      <div className="flex items-center justify-between px-12 py-4">
        <Link href="/" className="text-2xl font-bold">
          Blogi
        </Link>

       
        <div className="flex items-center gap-4">
          <ModeToggle />

          {user ? (
            <>
              <span className="text-sm hidden md:inline">{user.username}</span>
              <Button asChild variant="outline">
                <Link href="/blog">New Post</Link>
              </Button>
              <Button onClick={logout} variant="ghost">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/signin">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}