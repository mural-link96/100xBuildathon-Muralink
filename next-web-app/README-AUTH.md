# Authentication Architecture

## Overview

This application uses NextAuth.js for authentication, with Google as the primary authentication provider. The authentication system enables users to sign in with their Google accounts and access protected routes and API endpoints.

## Key Components

### 1. NextAuth.js Configuration (`src/app/api/auth/[...nextauth]/route.ts`)

This file configures NextAuth.js with the following features:
- Google OAuth provider integration
- JWT token handling
- Session management
- Custom redirect behavior

```typescript
// Example configuration
const handler = NextAuth({
  providers: [GoogleProvider({...})],
  callbacks: {
    async jwt({ token, account }) {...},
    async session({ session, token }) {...},
    async redirect({ url, baseUrl }) {...}
  }
});
```

### 2. Type Definitions (`src/types/next-auth.d.ts`)

Extends the default NextAuth.js types to include custom fields:

```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
  }

  interface JWT {
    accessToken?: string;
  }
}
```

### 3. Authentication Context (`src/app/context/AuthContext.tsx`)

Provides a React context for authentication state:
- Wraps the application with NextAuth's `SessionProvider`
- Makes authentication state available throughout the component tree
- Centralizes authentication-related state management

```typescript
export function AuthProvider({ children }: AuthContextProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### 4. Client-Side Utilities (`src/app/lib/authUtils.ts`)

Provides hooks and functions for client-side authentication:

```typescript
// Custom hook for accessing authentication state
export function useAuth() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = !!session;

  return {
    session,
    isLoading,
    isAuthenticated,
    signIn: (provider: string, options?: any) => signIn(provider, options),
    signOut: () => signOut(),
  };
}

// Utility for authenticated API calls
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Implementation
}
```

### 5. Authentication UI (`src/app/components/AuthStatus.tsx`)

Displays authentication status and provides sign-in/sign-out functionality:
- Shows user profile when authenticated
- Provides sign-in button when not authenticated
- Uses the `useAuth` hook to access authentication state

### 6. Route Protection (`src/middleware.ts`)

Protects routes at the middleware level:
- Checks authentication for protected routes
- Redirects unauthenticated users
- Handles both API routes and page routes

```typescript
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define protected routes
  const isProtectedApiRoute = path.includes('/api/generate-image') || path.includes('/api/baseten');
  const isProtectedPage = path.startsWith('/studio');

  // Check authentication for protected routes
  if (isProtectedApiRoute || isProtectedPage) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      // Handle unauthenticated requests
    }
  }
  
  return NextResponse.next();
}
```

## Authentication Flow

1. **Sign-In Process**:
   - User clicks the sign-in button in `AuthStatus.tsx`
   - NextAuth.js redirects to Google OAuth
   - User authenticates with Google
   - Google redirects back with an authorization code
   - NextAuth.js exchanges the code for tokens
   - JWT is created and stored in cookies
   - User is redirected to the application

2. **Session Management**:
   - NextAuth.js handles session persistence
   - Session information is available via the `useSession` hook
   - Custom `useAuth` hook provides a simplified interface

3. **Route Protection**:
   - Middleware checks for authentication on protected routes
   - Unauthenticated users are redirected or receive 401 responses
   - API routes use the same protection mechanism

4. **API Authentication**:
   - Frontend sends the Google OAuth token in the Authorization header
   - Additional user information is sent in custom headers (X-User-ID, X-User-Email, etc.)
   - Backend verifies the token and extracts user information
   - User data is available in API routes via `req.user`

## Backend Integration

The frontend authentication system integrates with the backend through:

1. **Token Passing**:
   - OAuth tokens are sent in the Authorization header
   - User information is sent in custom headers

2. **User Information**:
   - User ID, email, name, and profile image are passed to the backend
   - Backend extracts this information for user-specific operations

3. **CORS Configuration**:
   - Backend is configured to accept the custom authentication headers
   - Proper CORS settings ensure secure cross-origin requests

## Environment Variables

The authentication system requires the following environment variables:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000 (or your production URL)
NEXTAUTH_SECRET=your-nextauth-secret
```

## Security Considerations

1. **Token Handling**:
   - OAuth tokens are never exposed to the client-side JavaScript
   - HTTPS is used for all authentication-related requests
   - Tokens are stored in HTTP-only cookies

2. **CORS Protection**:
   - Strict CORS policies prevent unauthorized cross-origin requests
   - Only specified origins are allowed to access authentication endpoints

3. **Environment Variables**:
   - Sensitive credentials are stored in environment variables
   - Different environments (development, production) use different credentials

## Debugging Authentication

To debug authentication issues:

1. Check browser console for authentication-related errors
2. Verify that environment variables are correctly set
3. Inspect the session object using `console.log(session)`
4. Check network requests to `/api/auth/*` endpoints
5. Verify CORS headers in API responses
