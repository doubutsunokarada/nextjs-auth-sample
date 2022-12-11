import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const options: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (
          credentials?.email === "cred_test@example.com" &&
          credentials?.password === "password"
        ) {
          return { id: "1", name: "Test User", email: "cred_test@example.com" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    signIn: async () => {
      return true;
    },
    jwt: async ({ token }) => {
      token.userRole = "regular";
      return token;
    },
    session: ({ session }) => {
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(options);
