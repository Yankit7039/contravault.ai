// Authentication Button Component
// Handles sign in/sign out with Google OAuth - Professional Design

"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="px-4 py-2.5 rounded-lg" style={{ color: "#D3DAD9", opacity: 0.7 }}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ backgroundColor: "rgba(68, 68, 78, 0.3)" }}>
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-9 h-9 rounded-full border-2 shadow-md"
              style={{ borderColor: "#715A5A" }}
            />
          )}
          <div className="hidden sm:block">
            <div className="text-sm font-semibold" style={{ color: "#D3DAD9" }}>
              {session.user?.name || session.user?.email}
            </div>
            <div className="text-xs opacity-70" style={{ color: "#D3DAD9" }}>
              {session.user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)",
            color: "#D3DAD9",
            boxShadow: "0 4px 6px rgba(113, 90, 90, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(113, 90, 90, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(113, 90, 90, 0.2)";
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
      style={{
        background: "linear-gradient(135deg, #715A5A 0%, #5a4a4a 100%)",
        color: "#D3DAD9",
        boxShadow: "0 4px 6px rgba(113, 90, 90, 0.2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(113, 90, 90, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(113, 90, 90, 0.2)";
      }}
    >
      Sign in with Google
    </button>
  );
}
