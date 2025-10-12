import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodbClient";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, user }) {
      // Add user ID and role to the session
      if (user) {
        session.user.id = user.id;
        session.user.role = user.role || 'user';
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Check if user exists in our admins collection
      const { MongoClient } = require('mongodb');
      const client = new MongoClient(process.env.MONGO_URL);
      
      try {
        await client.connect();
        const db = client.db(process.env.DB_NAME || 'stichting_atlas');
        
        // Check if this email is an admin
        const adminUser = await db.collection('admins').findOne({ 
          email: user.email 
        });
        
        if (adminUser) {
          // Update user role in NextAuth users collection
          await db.collection('users').updateOne(
            { email: user.email },
            { $set: { role: adminUser.role || 'super_admin' } }
          );
        }
        
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        await client.close();
      }
      
      return true;
    },
    async redirect({ url, baseUrl }) {
      // After login, redirect to admin dashboard
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/admin/dashboard`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/admin",
  },
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
