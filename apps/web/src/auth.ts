import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import jwt from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    // Trigger when user press login button
    async signIn({ user }) {
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/users/lookup',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email }),
          },
        );
        const userData = await response.json();
        console.log(userData);

        if (!userData || !userData.data) {
          console.log(1);
          const response = await fetch(
            'http://localhost:8000/api/v1/auth/register',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                provider: 'GOOGLE',
                emailConfirmed: true,
              }),
            },
          );
          if (!response.ok) {
            console.error('Failed to register user');
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    // Trigger when Auth.js create the token
    async jwt({ token, user }) {
      if (user) {
        const response = await fetch(
          'http://localhost:8000/api/v1/users/lookup',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email }),
          },
        );
        const userData = await response.json();
        token.role = userData.data.role;
        console.log(userData);
        console.log(token);
      }
      return token;
    },
    // Trigger when Auth.js create session
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  jwt: {
    encode: ({ token }) => {
      if (!token) {
        throw new Error('Missing JWT token');
      }
      return jwt.sign(token, process.env.JWT_SECRET_KEY as string);
    },
    decode: ({ token }) => {
      if (!token) {
        throw new Error('Missing JWT token');
      }
      return jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JWT;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 3600,
  },
  cookies: {
    sessionToken: {
      name: 'accessToken',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain:
          process.env.NODE_ENV === 'production'
            ? 'frshbasket.shop'
            : 'localhost',
      },
    },
  },
});
