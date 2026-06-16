import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
    access_token?: string;
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    access_token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    access_token?: string;
  }
}