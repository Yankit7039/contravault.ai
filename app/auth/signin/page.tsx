// Sign In Page
// Beautiful login page with Google OAuth using the app color palette

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#D3DAD9" }}>
      <div className="w-full max-w-md px-6 py-8">
        {/* Login Card */}
        <div 
          className="rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: "#37353E" }}
        >
          {/* Header Section */}
          <div 
            className="px-8 pt-10 pb-6 text-center"
            style={{ backgroundColor: "#44444E" }}
          >
            <div className="mb-4">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <Image
                  src="/Gemini_Generated_Image_f6rbb4f6rbb4f6rb.png"
                  alt="Planix Logo"
                  width={80}
                  height={80}
                  className="rounded-full"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#D3DAD9" }}>
                Welcome to Planix
              </h1>
              <p className="text-sm" style={{ color: "#D3DAD9", opacity: 0.8 }}>
                Sign in to manage your tasks
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-8">
            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              style={{
                backgroundColor: isLoading ? "#44444E" : "#715A5A",
                color: "#D3DAD9",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#5a4a4a";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#715A5A";
                }
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Footer Text */}
            <p className="text-center mt-6 text-sm" style={{ color: "#D3DAD9", opacity: 0.7 }}>
              Secure authentication powered by Google
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: "#715A5A" }}>
            Your tasks, organized and secure
          </p>
        </div>
      </div>
    </div>
  );
}
