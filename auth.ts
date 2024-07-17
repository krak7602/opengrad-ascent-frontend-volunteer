import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
        id: { label: "Id" },
      },
      authorize: async (credentials) => {
        let volunteer1 = null;
        let partner1 = null;
        let admin1 = null;
        const { email, password, role } =
          await signInSchema.parseAsync(credentials);
        try {
          const resp = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            {
              email: email,
              password: password,
            },
          );

          const resp2 = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/getfulldata`,
            {
              headers: {
                authorization: `Bearer ${resp.data.token}`,
              },
            },
          );

          if (resp.data.id) {
            return {
              email: email,
              password: password,
              role: role,
              auth_id: resp2.data.id,
              auth_token: resp.data.token,
            };
          }
        } catch (e) {
          console.log(e);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.auth_id = user.auth_id;
        token.auth_token = user.auth_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.auth_id = token.auth_id;
        session.user.auth_token = token.auth_token;
      }
      return session;
    },
  },
  trustHost: true,
});
