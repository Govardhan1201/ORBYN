import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { usersRepo } from '@/lib/db/repositories/users.repo';
import { MongoClient } from 'mongodb';
import { MongoDBAdapter } from '@auth/mongodb-adapter';

const client = new MongoClient(process.env.MONGODB_URI!);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client, { databaseName: process.env.MONGODB_DB_NAME || 'orbyn' }),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await usersRepo.findByEmail(credentials.email as string);
        if (!user) return null;

        const valid = await usersRepo.verifyPassword(user, credentials.password as string);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
          preferences: user.preferences,
        };
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'user';
        token.preferences = (user as any).preferences;
      }

      // On Google OAuth sign in, create/fetch user
      if (account?.provider === 'google' && token.email) {
        let dbUser = await usersRepo.findByEmail(token.email);
        if (!dbUser) {
          dbUser = await usersRepo.create({
            email: token.email,
            name: token.name || 'User',
            googleId: token.sub,
            avatar: token.picture as string | undefined,
          });
        } else if (!dbUser.googleId) {
          // Link google account
          const { getDb } = await import('@/lib/db/mongodb');
          const db = await getDb();
          const { ObjectId } = await import('mongodb');
          await db.collection('users').updateOne(
            { _id: dbUser._id },
            { $set: { googleId: token.sub, emailVerified: true } }
          );
        }
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.preferences = dbUser.preferences;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).preferences = token.preferences;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export type AuthSession = Awaited<ReturnType<typeof auth>>;
