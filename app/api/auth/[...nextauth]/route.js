import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // example

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login", // optional custom login page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
