// Main Dashboard Page
// Displays tasks and handles authentication

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import AuthButton from "@/components/AuthButton";
import TaskList from "@/components/TaskList";

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
        <div style={{ color: "#715A5A" }}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#D3DAD9" }}>
      <header 
        className="shadow-lg border-b"
        style={{ 
          backgroundColor: "#37353E",
          borderColor: "#44444E"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/Gemini_Generated_Image_f6rbb4f6rbb4f6rb.png"
                alt="Planix Logo"
                width={40}
                height={40}
                className="rounded-full"
                style={{ objectFit: "cover" }}
              />
              <h1 
                className="text-2xl font-bold"
                style={{ color: "#D3DAD9" }}
              >
                Planix
              </h1>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskList />
      </main>
    </div>
  );
}
