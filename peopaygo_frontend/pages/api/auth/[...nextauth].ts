import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Type your email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const response = await axios.post('http://localhost:8000/auth/login', {
          email: credentials?.email,
          password: credentials?.password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const user = response.data;
        if (user.accessToken && user.user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: "SECRETWORD",
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
});