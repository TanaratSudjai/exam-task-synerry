import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRepository } from "@/lib/user-db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@admin.com" },
        password: { label: "Password", type: "password", placeholder: "123456" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await UserRepository.findByEmail(credentials.email);
          if (!user) return null;

          const isMatch = await bcrypt.compare(credentials.password, user.password_hash);
          if (isMatch) {
            return {
              id: user.id.toString(),
              name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
              email: user.email,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
