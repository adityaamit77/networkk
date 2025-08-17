import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';

export const authOptions = {
  session: { strategy: 'jwt' as const },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        // For now we compare plain text. In production, hash and verify passwords securely.
        if (user.passwordHash !== credentials.password) return null;
        return { id: String(user.id), email: user.email, name: user.name, role: user.role } as any;
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
};

export default NextAuth(authOptions);
