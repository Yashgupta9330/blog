"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/page-loader";

interface AuthLayout {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayout) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <PageLoader />;

  return <>{children}</>;
}
