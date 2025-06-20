// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        // Store the provider ID to identify the authentication method
        token.provider = account.provider;

        // Call backend /api/v1/auth/google with Google access_token
        try {
          const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_FAST_API_URL_LOGIN}/api/v1/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: account.id_token,
              role: 'home', // Changed from 'pro' to 'home' as requested
            }),
          });

          if (!backendResponse.ok) {
            console.error('Backend authentication failed:', backendResponse.status);
            token.backendAuthError = true;
            token.backendAccessToken = undefined;
          } else {
            const data = await backendResponse.json();
            // Assume backend returns { access_token: '...' }
            token.backendAccessToken = data.access_token;
            token.backendAuthError = false;
          }
        } catch (err) {
          console.error('Backend authentication error:', err);
          token.backendAuthError = true;
          token.backendAccessToken = undefined;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to the session
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      
      // Add access token to the session
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken;
      }
      
      // Add backend access token to the session
      if (token.backendAccessToken) {
        (session as any).backendAccessToken = token.backendAccessToken;
      }
      
      // Add backend auth error status
      if (token.backendAuthError !== undefined) {
        (session as any).backendAuthError = token.backendAuthError;
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home page after sign in since there's no studio
      if (url.startsWith(baseUrl)) {
        return baseUrl;
      } else if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      return baseUrl; // Default to home page
    },
  },
  pages: {
    signIn: '/', // Custom sign-in page (optional)
  },
});

export { handler as GET, handler as POST };