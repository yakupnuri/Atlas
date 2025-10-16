import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodbClient";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "crm-credentials",
      name: "CRM Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGO_URL);
        
        try {
          await client.connect();
          const db = client.db(process.env.DB_NAME || 'stichting_atlas');
          
          // Check crm_users collection
          const crmUser = await db.collection('crm_users').findOne({ 
            email: credentials.email 
          });
          
          if (!crmUser) {
            console.log(`❌ CRM user not found: ${credentials.email}`);
            return null;
          }
          
          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password, 
            crmUser.password
          );
          
          if (!isValidPassword) {
            console.log(`❌ Invalid password for: ${credentials.email}`);
            return null;
          }
          
          console.log(`✅ CRM login success: ${credentials.email}`);
          
          return {
            id: crmUser._id.toString(),
            email: crmUser.email,
            name: crmUser.name,
            role: crmUser.role || 'volunteer',
            firstLogin: crmUser.firstLogin || false,
            provider: 'crm-credentials'
          };
          
        } catch (error) {
          console.error('Error during CRM login:', error);
          return null;
        } finally {
          await client.close();
        }
      }
    }),
  ],
  // No adapter needed for JWT strategy
  callbacks: {
    async session({ session, user, token }) {
      // Add user ID and role to the session
      if (token) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role || 'user';
        session.user.firstLogin = token.firstLogin || false;
        session.user.provider = token.provider || 'google';
      } else if (user) {
        session.user.id = user.id;
        session.user.role = user.role || 'user';
        session.user.firstLogin = user.firstLogin || false;
        session.user.provider = user.provider || 'google';
      }
      return session;
    },
    async jwt({ token, user }) {
      // Store user info in JWT token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstLogin = user.firstLogin;
        token.provider = user.provider;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      // Skip admin check for CRM credentials login
      if (account.provider === 'crm-credentials') {
        return true; // Already verified in authorize()
      }
      
      // Only allow sign-in if user email exists in admins collection (for Google OAuth)
      const { MongoClient } = require('mongodb');
      const client = new MongoClient(process.env.MONGO_URL);
      
      try {
        await client.connect();
        const db = client.db(process.env.DB_NAME || 'stichting_atlas');
        
        // Check if this email is in admins collection
        const adminUser = await db.collection('admins').findOne({ 
          email: user.email 
        });
        
        if (!adminUser) {
          // User not authorized - email not in admins collection
          console.log(`❌ Access denied for: ${user.email} - Not in admins list`);
          return false; // Reject sign-in
        }
        
        console.log(`✅ Access granted for: ${user.email} (Role: ${adminUser.role})`);
        
        // Update user role in NextAuth users collection
        await db.collection('users').updateOne(
          { email: user.email },
          { $set: { role: adminUser.role || 'super_admin' } },
          { upsert: true }
        );
        
        return true; // Allow sign-in
        
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false; // Reject on error
      } finally {
        await client.close();
      }
    },
    async redirect({ url, baseUrl }) {
      // After CRM login, redirect to CRM dashboard
      if (url.includes('/crm')) {
        return `${baseUrl}/crm/dashboard`;
      }
      // After admin login, redirect to admin dashboard
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/admin/dashboard`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/admin",
    error: "/admin/auth-error",
  },
  session: {
    strategy: "jwt", // Changed to JWT to support CredentialsProvider
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
