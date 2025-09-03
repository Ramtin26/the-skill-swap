import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createUser, getUser } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },

    async signIn({ user, account, profile, req }) {
      try {
        const existingUser = await getUser(user.email);

        if (!existingUser)
          await createUser({
            email: user.email,
            fullName: user.name,
            role: null,
          });

        return true;
      } catch (err) {
        console.error("Error during sign in", err);
        return false;
      }
    },
    async jwt({ token, user, trigger }) {
      // if (user) {
      //   // enrich JWT with DB user data
      //   const dbUser = await getUser(user.email);
      //   token.seekerId = dbUser.id;
      //   token.role = dbUser.role;
      // }
      // return token;
      if (user || trigger === "update") {
        try {
          const dbUser = await getUser(token.email || user?.email);
          if (dbUser) {
            token.seekerId = dbUser.id;
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error("Error fetching user in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, user, token }) {
      // const dbUser = await getUser(session.user.email);
      // session.user.seekerId = dbUser.id;
      // session.user.role = dbUser.role;
      session.user.seekerId = token.seekerId;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
