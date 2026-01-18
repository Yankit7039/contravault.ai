// NextAuth configuration
// Google OAuth setup and session management

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getUsersCollection } from "@/lib/db/collections";
import type { User } from "@/types";

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
  throw new Error(
    "Missing NEXTAUTH_SECRET or AUTH_SECRET. Please add one to your .env.local file."
  );
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID. Please add it to your .env.local file.");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Missing GOOGLE_CLIENT_SECRET. Please add it to your .env.local file."
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true, // Trust host header in production
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Ensure email exists before proceeding
        if (!user.email) {
          console.error("User email is missing");
          return false;
        }

        try {
          const usersCollection = await getUsersCollection();
          
          // Check if user exists
          const existingUser = await usersCollection.findOne({
            email: user.email,
          });

          // If user doesn't exist, create a new one
          if (!existingUser) {
            await usersCollection.insertOne({
              email: user.email,
              name: user.name || "",
              image: user.image || "",
              createdAt: new Date(),
            } as User);
          } else {
            // Update user info if needed
            await usersCollection.updateOne(
              { email: user.email },
              {
                $set: {
                  name: user.name || existingUser.name,
                  image: user.image || existingUser.image,
                },
              }
            );
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && session.user.email) {
        try {
          const usersCollection = await getUsersCollection();
          const user = await usersCollection.findOne({
            email: session.user.email,
          });
          
          if (user && user._id) {
            (session.user as { id?: string }).id = user._id.toString();
          }
        } catch (error) {
          console.error("Error in session callback:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
