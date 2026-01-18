// Authentication Button Component
// Handles sign in/sign out with Google OAuth

"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="px-4 py-2" style={{ color: "#D3DAD9", opacity: 0.7 }}>
        Loading...
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-8 h-8 rounded-full border-2"
              style={{ borderColor: "#715A5A" }}
            />
          )}
          <span className="text-sm" style={{ color: "#D3DAD9" }}>
            {session.user?.name || session.user?.email}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-lg"
          style={{
            backgroundColor: "#715A5A",
            color: "#D3DAD9",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#5a4a4a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#715A5A";
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
      className="px-4 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-lg"
      style={{
        backgroundColor: "#715A5A",
        color: "#D3DAD9",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#5a4a4a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#715A5A";
      }}
    >
      Sign in with Google
    </button>
  );
}
