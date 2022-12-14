import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prismadb";
import bcrypt from "bcrypt";

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (user !== null) {
          if (
            typeof credentials?.password === "string" &&
            typeof user.password === "string"
          ) {
            const compared = await bcrypt.compare(
              credentials?.password,
              user.password
            );
            if (compared) {
              return { id: user.id, name: user.name, email: user.email };
            }
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(options);
