import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcryptjs from "bcryptjs";
import User from "@/models/user";
import connectDB from "@/utils/connectDB";
import clientPromise from "@/utils/mongoConnect";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions, SessionStrategy } from "next-auth";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      async profile(profile) {
        return {
          id: profile.sub,
          username: profile.sub,
          email: profile.email,
          emailVerified: profile.email_verified,
          name: profile.name,
          image: profile.picture,
          emailToken: null,
          isActive: true,
          role: "User",
        };
      },
      httpOptions: {
        timeout: 10000,
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials): Promise<any> {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          await connectDB();
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("Invalid email or password");
          }
          const isPasswordValid = await bcryptjs.compare(
            password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }
          return user;
        } catch (error) {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 60,
    updateAge: 1 * 60,
  },
  pages: {
    error: "/auth/error",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl + "/userDashboard";
    },

    async jwt({ token, trigger, session, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.id = user.id;
        token.image = user.image;
        token.isActive = user.isActive;
        token.role = user.role;
      } else if (trigger === "update" && session?.name) {
        token.email = user["email"];
        token.name = user["name"];
        token.id = user["id"];
        token.image = user["image"];
        token.isActive = user["isActive"];
        token.role = user["role"];
      }
      return token;
    },
    async session({ session, token }) {
      await connectDB();
      const userEmail = session?.user?.email;
      const dbUser = await User.findOne({ email: userEmail });

      if (dbUser) {
        session.user.email = dbUser.email;
        session.user.name = dbUser.name;
        session.user.id = dbUser.id;
        session.user.image = dbUser.image;
        session.user.isActive = dbUser.isActive;
        session.user.role = dbUser.role;
      } else {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.id = token.id;
        session.user.image = token.image;
        session.user.isActive = token.isActive;
        session.user.role = token.role;
      }
      return session;
    },
  },
} as NextAuthOptions;
