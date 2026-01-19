import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import User from "@/models/user";
import connectDB from "@/utils/connectDB";
import clientPromise from "@/utils/mongoConnect";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions, SessionStrategy } from "next-auth";
import { logFailedLogin, logSuccessfulLogin } from "@/utils/auditLogger";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  adapter: MongoDBAdapter(clientPromise),
  // Explicitly enable secure cookies and CSRF protection
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.callback-url"
          : "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-next-auth.csrf-token"
          : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
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
          provider: "google",
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
            // Log failed login attempt - user not found
            await logFailedLogin(email, "User not found");
            throw new Error("Invalid email or password");
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            // Log failed login attempt - invalid password
            await logFailedLogin(email, "Invalid password");
            throw new Error("Invalid email or password");
          }

          // Log successful login
          await logSuccessfulLogin(user.id, user.email, user.name, user.role);

          return { ...user.toObject(), provider: "credentials" };
        } catch (error) {
          // Log general authentication error if not already logged
          if (
            error instanceof Error &&
            error.message === "Invalid email or password"
          ) {
            throw error;
          }
          await logFailedLogin(email, "Authentication error");
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 1 * 60 * 60, // 1 hour
    updateAge: 1 * 60, // 1 minute
  },
  pages: {
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }: any) {
      try {
        await connectDB();
        if (user?.email) {
          await User.updateOne(
            { email: user.email },
            { $set: { lastLoginTime: new Date() } },
          );
        }
      } catch (err) {
        console.error("⚠️ [AUTH SIGNIN] Failed to update lastLoginTime", err);
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl + "/userDashboard";
    },

    async jwt({ token, trigger, session, user }: any) {
      // Log only on initial authentication (user object only exists on first JWT creation)
      // For Credentials: logging already happens in authorize callback
      // For OAuth (Google): this is the only place we get the user object on first auth
      if (user && !(token as any).loggedAt) {
        // Only log if we haven't already logged this token
        console.log("🔐 [AUTH JWT] User authenticated:", (user as any).email);
        if (
          (user as any).id &&
          (user as any).email &&
          (user as any).name &&
          (user as any).role
        ) {
          await logSuccessfulLogin(
            (user as any).id,
            (user as any).email,
            (user as any).name,
            (user as any).role,
          );
        }
        // Mark that we've logged this token to avoid duplicate logs
        (token as any).loggedAt = new Date().getTime();
      }

      if (user) {
        (token as any).email = (user as any).email;
        (token as any).name = (user as any).name;
        (token as any).id = (user as any).id;
        (token as any).image = (user as any).image;
        (token as any).isActive = (user as any).isActive;
        (token as any).role = (user as any).role;
        (token as any).provider = (user as any).provider ?? "credentials";
      } else if (trigger === "update" && session?.name) {
        (token as any).email = (user as any)?.["email"];
        (token as any).name = (user as any)?.["name"];
        (token as any).id = (user as any)?.["id"];
        (token as any).image = (user as any)?.["image"];
        (token as any).isActive = (user as any)?.["isActive"];
        (token as any).role = (user as any)?.["role"];
        (token as any).provider = (user as any)?.["provider"] ?? "credentials";
      }
      return token;
    },
    async session({ session, token }: any) {
      try {
        await connectDB();
        const userEmail = session?.user?.email;
        const dbUser = await User.findOne({ email: userEmail });

        if (dbUser && session?.user) {
          (session.user as any).email = dbUser.email;
          (session.user as any).name = dbUser.name;
          (session.user as any).id = dbUser.id;
          (session.user as any).image = dbUser.image;
          (session.user as any).isActive = dbUser.isActive;
          (session.user as any).role = dbUser.role;
          (session.user as any).provider = token.provider ?? "credentials";
        } else if (session?.user) {
          (session.user as any).email = token.email;
          (session.user as any).name = token.name;
          (session.user as any).id = token.id;
          (session.user as any).image = token.image;
          (session.user as any).isActive = token.isActive;
          (session.user as any).role = token.role;
          (session.user as any).provider = token.provider ?? "credentials";
        }
        return session;
      } catch (error) {
        console.error("  [AUTH SESSION] Session callback error:", error);
        throw error;
      }
    },
  },
} as NextAuthOptions;
