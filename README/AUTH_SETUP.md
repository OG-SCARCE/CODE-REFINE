# CodeRefine-ONSLAUGHT Authentication Setup

This document describes the Supabase authentication implementation for the CodeRefine application.

## Overview

The application now enforces authentication on the analyzer feature. Unauthenticated users are redirected to the login/signup page before accessing the code analysis tool.

## Authentication Flow

### User Journey

1. **Unauthenticated User on Home Page**
   - Clicks "Analyze Code" or "Start Free" button
   - Gets redirected to `/signup` page

2. **Sign Up Process**
   - User fills in name, email, and password
   - Data is validated client-side
   - Request is sent to Supabase auth endpoint
   - On successful signup, user is automatically signed in
   - User is redirected to `/analyzer`

3. **Login Process**
   - User enters email and password
   - Data is validated client-side
   - Request is sent to Supabase auth endpoint
   - On successful login, user is redirected to `/analyzer`

4. **Analyzer Page (Protected Route)**
   - User is authenticated via Supabase session
   - `useAuth()` hook checks for valid session
   - If authenticated, analyzer is accessible
   - If not authenticated, user is redirected to `/login`
   - Sign Out button allows user to logout

## Key Components

### 1. Authentication Hook (`hooks/useAuth.ts`)

Provides two hooks for managing authentication:

```typescript
// useAuth() - Check auth status and logout
const { user, isLoading, error, logout } = useAuth()

// useProtectedRoute() - Automatically redirect if not authenticated
const { user, isLoading } = useProtectedRoute()
```

**Features:**
- Checks session on mount
- Listens for auth state changes
- Provides logout functionality
- Handles errors gracefully

### 2. Protected Routes

The analyzer route (`/app/analyzer/page.tsx`) now:
- Uses `useAuth()` to check authentication status
- Shows loading state while checking auth
- Redirects unauthenticated users to `/login`
- Displays user-specific features (Sign Out button)

### 3. Middleware (`middleware.ts`)

Server-side route protection:
- Checks for Supabase session in cookies
- Redirects to `/login` if session is invalid
- Applies to protected routes: `/analyzer`

### 4. Updated Pages

**Login Page (`app/login/page.tsx`)**
- Integrated with Supabase auth
- Validates email and password
- Calls `supabase.auth.signInWithPassword()`
- Redirects to `/analyzer` on success
- Shows error messages

**Signup Page (`app/signup/page.tsx`)**
- Integrated with Supabase auth
- Validates all fields
- Calls `supabase.auth.signUp()`
- Stores user's full name in Supabase metadata
- Redirects to `/analyzer` on success
- Shows error messages

**Home Page (`app/page.tsx`)**
- Uses `useAuth()` to check if user is logged in
- "Analyze Code" button redirects based on auth status:
  - If authenticated → `/analyzer`
  - If not authenticated → `/signup`

## Environment Variables

Required Supabase environment variables:

```
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Set these in your `.env.local` file.

## Security Considerations

1. **Password Requirements**
   - Minimum 6 characters
   - Validated on both client and server

2. **Email Validation**
   - Format checked before submission
   - Unique constraint enforced by Supabase

3. **Session Management**
   - Supabase automatically manages sessions
   - Sessions stored in secure cookies
   - Middleware validates session on protected routes

4. **Protected Routes**
   - Both client-side and server-side protection
   - Client-side prevents unnecessary rendering
   - Server-side prevents direct access attempts

## Testing the Authentication

### Test Sign Up
1. Navigate to home page
2. Click "Analyze Code"
3. Should redirect to `/signup`
4. Fill in all fields and submit
5. Should be redirected to `/analyzer`

### Test Login
1. Logout if currently authenticated
2. Click "Analyze Code" on home page
3. Should redirect to `/signup`
4. Click "Sign in" link
5. Enter credentials and submit
6. Should be redirected to `/analyzer`

### Test Route Protection
1. Try accessing `/analyzer` directly without being logged in
2. Should be redirected to `/login`
3. Login and access `/analyzer`
4. Should successfully load the analyzer

### Test Logout
1. In analyzer page, click "Sign Out" button
2. Should be redirected to home page
3. Try accessing `/analyzer` again
4. Should redirect to login

## Troubleshooting

### "Supabase client not initialized"
- Check that environment variables are set
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is accessible in browser

### "Auth check failed"
- Check browser console for errors
- Verify Supabase project is active
- Check Supabase URL and keys

### Cannot login after signup
- Verify email confirmation is not required (check Supabase settings)
- Check user exists in Supabase Auth dashboard
- Clear browser cookies and try again

### Infinite redirect loop
- Check middleware configuration
- Verify protected routes are correctly configured
- Check Supabase session is valid

## Future Enhancements

1. Email verification before access
2. Password reset functionality
3. Social login (Google, GitHub)
4. Two-factor authentication
5. User profile management
6. Session timeout handling
