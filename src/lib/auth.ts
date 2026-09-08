import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "AgriConnect Credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "Mock OTP", type: "text" },
        roleSwitchUserId: { label: "Demo Role Switch", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Fast Demo Role Switch (allows instant demo testing between roles)
        if (credentials.roleSwitchUserId) {
          const user = await db.user.findUnique({
            where: { id: credentials.roleSwitchUserId },
            include: {
              farmerProfile: true,
              fpoProfile: true,
              buyerProfile: true,
            }
          });
          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
              district: user.district,
            };
          }
        }

        const identifier = credentials.identifier?.trim();
        if (!identifier) return null;

        // Find user by email or phone
        const user = await db.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { phone: identifier }
            ]
          },
          include: {
            farmerProfile: true,
            fpoProfile: true,
            buyerProfile: true,
          }
        });

        if (!user) return null;

        // If OTP provided (Farmers often log in with OTP: 123456)
        if (credentials.otp) {
          if (credentials.otp === "123456" || credentials.otp.length === 6) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
              district: user.district,
            };
          }
        }

        // Standard password check (demo password is 'demo123')
        if (credentials.password === "demo123" || credentials.password === user.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            district: user.district,
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.phone = (user as any).phone;
        token.district = (user as any).district;
      }
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).phone = token.phone as string;
        (session.user as any).district = token.district as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "agriconnect-maharashtra-secret-token-key-32charsmin",
};
