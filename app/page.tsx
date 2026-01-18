// Main Dashboard Page
// Displays tasks and handles authentication

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import AuthButton from "@/components/AuthButton";
import EnhancedTaskList from "@/components/EnhancedTaskList";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div 
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#D3DAD9" }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent mb-4" style={{ color: "#715A5A" }}></div>
          <div className="text-lg font-semibold" style={{ color: "#37353E" }}>Loading Planix...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#D3DAD9" }}>
      <header 
        className="shadow-xl border-b backdrop-blur-sm sticky top-0 z-40"
        style={{ 
          background: "linear-gradient(135deg, #37353E 0%, #44444E 100%)",
          borderColor: "rgba(68, 68, 78, 0.3)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src="/Gemini_Generated_Image_f6rbb4f6rbb4f6rb.png"
                  alt="Planix Logo"
                  width={48}
                  height={48}
                  className="rounded-full shadow-md border-2"
                  style={{ 
                    objectFit: "cover",
                    borderColor: "#715A5A",
                  }}
                />
              </div>
              <div>
                <h1 
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: "#D3DAD9" }}
                >
                  Planix
                </h1>
                <p className="text-xs font-medium opacity-70" style={{ color: "#D3DAD9" }}>
                  Your productivity companion
                </p>
              </div>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EnhancedTaskList />
      </main>
    </div>
  );
}
