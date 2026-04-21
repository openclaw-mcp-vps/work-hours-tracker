import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { hasPurchaseForEmail } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      paid: boolean;
    };
  }

  interface User {
    paid: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    paid?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/access"
  },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const hasPaid = await hasPurchaseForEmail(email);

        if (!hasPaid) {
          return null;
        }

        return {
          id: email,
          email,
          name: email.split("@")[0],
          paid: true
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.paid = user.paid;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user || !session.user.email) {
        return session;
      }

      session.user = {
        id: session.user.email,
        email: session.user.email,
        name: session.user.name ?? session.user.email.split("@")[0],
        paid: Boolean(token.paid)
      };

      return session;
    }
  }
};
