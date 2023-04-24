import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const allowedDomains = process.env.ALLOWED_DOMAINS.split(',');

console.log('Auth0 Domain:', process.env.AUTH0_DOMAIN);
console.log('Auth0 Client ID:', process.env.AUTH0_CLIENT_ID);
console.log('Auth0 Client Secret:', process.env.AUTH0_CLIENT_SECRET);

const returnUserRole = (email) => {
  if (process.env.NEXT_PUBLIC_ADMIN_EMAILS && process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',').some(e => e.trim() === email)) {
    return 'admin';
  } else if (allowedDomains.includes(email.split('@')[1])) {
    return 'user';
  } else {
    throw new Error('User not allowed');
  }
};

export const authOptions = {
  adapter: UpstashRedisAdapter(redis),
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
      issuer: `https://${process.env.AUTH0_DOMAIN}`,
    }),
  ],
  callbacks: {
    async session(session) {
      return {
        ...session.session,
        user: {
          ...session.user,
          role: returnUserRole(session.user.email),
        },
      };
    },
  },
};

export default NextAuth(authOptions);
