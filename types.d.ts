import { type DefaultSession } from "next-auth";
declare module "next-auth" {
  interface User {
    role: string;
    auth_id?: number;
    auth_token?: string;
  }
  interface Session {
    user: {
      role: string;
      auth_id?: number;
      auth_token?: string;
    } & DefaultSession["user"];
  }
}

import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    auth_id?: number;
    auth_token?: string;
  }
}
