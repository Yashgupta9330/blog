"use client"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { ModeToggle } from "@/components/toggle-theme"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo and Mode Toggle */}
      <div className="flex items-center justify-between w-full max-w-md mb-8">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <span className="text-xl font-bold">Blogi</span>
        </Link>
        <ModeToggle />
      </div>
      {/* Login Form */}
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
