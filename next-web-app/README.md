# web-app
Muralink Website and Muralink Design Studio

# Development Setup
- Clone the repository and checkout develop branch
- run npm install
- make sure all node modules got installed
- run npm run dev

# Configure Different Baseten Models
- Click on Settings from Github Website for the repo muralink-96/web-app
- Go to Security -> Secret and Variables -> Actions
- Edit the Model you want to edit , All model variables starts with NEXT_PUBLIC and end with _DEV for dev environment and _PROD for production environment
- eg : NEXT_PUBLIC_3D_RENDER_MODEL_ID_DEV, NEXT_PUBLIC_SKETCH_RENDER_MODEL_ID_DEV
- If you don't have access to edit these secret variables please contact the admin
- once updated go to Actions tab at top
- Re run all the jobs for last successful build from develop branch, your new model will get integrated with ui and changes will be visible at https://dev.muralinkdesig

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

### 2. Type Definitions (`src/types/next-auth.d.ts`)

Extends the default NextAuth.js types to include custom fields for the session and JWT objects.

### 3. Authentication Context (`src/app/context/AuthContext.tsx`)

Provides a React context for authentication state:
- Wraps the application with NextAuth's `SessionProvider`
- Makes authentication state available throughout the component tree

### 4. Client-Side Utilities (`src/app/lib/authUtils.ts`)

Provides hooks and functions for client-side authentication:
- Custom `useAuth` hook for accessing authentication state
- `fetchWithAuth` utility for authenticated API calls

### 5. Authentication UI (`src/app/components/AuthStatus.tsx`)

Displays authentication status and provides sign-in/sign-out functionality.

### 6. Route Protection (`src/middleware.ts`)

Protects routes at the middleware level for both API routes and page routes.

## Authentication Flow

1. **Sign-In Process**: User authenticates with Google OAuth
2. **Session Management**: NextAuth.js handles session persistence
3. **Route Protection**: Middleware checks for authentication on protected routes
4. **API Authentication**: Frontend sends the Google OAuth token to the backend

## Backend Integration

The frontend authentication system integrates with the backend through:

1. **Token Passing**: OAuth tokens are sent in the Authorization header
2. **User Information**: User ID, email, name, and profile image are passed to the backend
3. **CORS Configuration**: Backend is configured to accept the custom authentication headers

## Environment Variables

The authentication system requires the following environment variables:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000 (or your production URL)
NEXTAUTH_SECRET=your-nextauth-secret
```

For more detailed documentation on the authentication system, see [README-AUTH.md](README-AUTH.md).
