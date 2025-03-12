"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"
import BtnLoader from "@/components/btn-loader"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { useAuth } from "@/context/auth-context"


const signupSchema = z
  .object({
    userName: z.string().min(7, "Please provide user name"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  })
 
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { registerUser } = useAuth()
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    console.log("submitted")
    setLoading(true)
    const { userName, email, password } = data
    try {
      const res = await registerUser(userName, email, password)
      console.log("res ",res)
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong during signup. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground text-sm">Enter your details below to get started</p>
      </div>

      <form className={cn("space-y-4", className)} {...props} onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="userName">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input id="userName" type="text" className="pl-10" placeholder="John Doe" {...register("userName")} />
          </div>
          {errors.userName && <p className="text-sm font-medium text-destructive">{errors.userName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input id="email" type="email" className="pl-10" placeholder="you@example.com" {...register("email")} />
          </div>
          {errors.email && <p className="text-sm font-medium text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="pl-10"
              placeholder="••••••••"
              {...register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
          {errors.password && <p className="text-sm font-medium text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="pl-10"
              placeholder="••••••••"
              {...register("confirmPassword")}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm font-medium text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <BtnLoader /> : "Create Account"}
        </Button>
      </form>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary hover:underline"> 
              Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

