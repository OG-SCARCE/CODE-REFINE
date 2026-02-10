# Authentication Redirect Fix Guide

## Problem Fixed
When users successfully logged in or signed up, they were stuck on the login/signup page instead of being redirected to the analyzer.

## Root Causes Identified and Fixed

### 1. **Race Condition in Session Establishment**
**Problem**: Supabase's `signInWithPassword()` returns immediately, but the session might not be fully established in the browser's secure storage.

**Fix**: Added a 500ms delay after successful authentication before redirecting:
```typescript
if (data.user) {
  await new Promise(resolve => setTimeout(resolve, 500))
  router.push('/analyzer')
  return
}
```

### 2. **Unauthenticated Check Timing**
**Problem**: The analyzer page was checking `if (!user)` synchronously before the session listener in `useAuth` hook could update the user state.

**Fix**: Added a proper `useEffect` hook in the analyzer page that:
- Waits for `authLoading` to be false
- Only redirects if user is actually null
- Doesn't trigger on initial mount

### 3. **Unused Redirect Function**
**Problem**: The analyzer page had a `handleRedirectToLogin()` function that was never called.

**Fix**: Removed the function and replaced it with a proper `useEffect` hook that automatically handles redirects.

## Changes Made

### File: `app/login/page.tsx`
- Changed redirect trigger from `if (data.session)` to `if (data.user)`
- Added 500ms delay before redirect to ensure session is established
- Moved `setIsLoading(false)` to catch block only

### File: `app/signup/page.tsx`
- Same changes as login page
- Added proper timing to ensure session establishment

### File: `app/analyzer/page.tsx`
- Added `useEffect` hook to handle unauthenticated user redirects
- Now properly waits for auth check to complete before rendering
- Early return prevents rendering while not authenticated

## Testing the Fix

### Test Scenario 1: New User Sign Up
1. Go to home page
2. Click "Analyze Code" button
3. You should redirect to signup (not authenticated)
4. Fill in signup form and submit
5. ✅ Should redirect to analyzer page (not stay on signup)
6. Verify "Sign Out" button appears in analyzer

### Test Scenario 2: Existing User Login
1. Go to home page
2. Click "Analyze Code" button
3. You should redirect to login
4. Fill in login form with existing credentials
5. ✅ Should redirect to analyzer page (not stay on login)
6. Verify you can use the code analyzer

### Test Scenario 3: Direct URL Access (Not Authenticated)
1. Open `/analyzer` directly in browser
2. ✅ Should show loading state briefly
3. ✅ Should redirect to `/login` automatically

### Test Scenario 4: Auth Persistence
1. Sign up successfully
2. Go to analyzer and analyze code
3. Refresh the page with F5
4. ✅ Should still be on analyzer (not redirect to login)
5. Session should persist

## Technical Details

### The useAuth Hook Lifecycle
```
1. Component mounts
2. useAuth hook sets isLoading = true
3. useAuth checks session with getSession()
4. onAuthStateChange listener is set up
5. If user exists → setUser(), isLoading = false
6. If no user → setUser(null), isLoading = false
```

### The Analyzer Redirect Flow
```
1. User navigates to /analyzer
2. Component mounts
3. useAuth checks session (isLoading = true)
4. Analyzer renders loading state
5. Session check completes (isLoading = false)
6. If user = null → useEffect triggers router.push('/login')
7. If user exists → Analyzer renders normally
```

### The Login Redirect Flow
```
1. User submits login form
2. signInWithPassword() called
3. Supabase returns user object
4. 500ms delay (ensures session storage)
5. router.push('/analyzer')
6. Navigation to analyzer
7. Analyzer's useAuth hook detects user
8. User sees analyzer page
```

## Debugging Tips

If you still see redirect issues:

### Check Supabase Connection
```
Open DevTools → Application → Cookies
Look for: sb-XXXX-auth-token
Should contain your session JWT
```

### Check Console Logs
```
1. Open DevTools → Console
2. Go to signup or login
3. Fill form and submit
4. Check for any errors
5. Should see console logs about session changes
```

### Add Debug Console.logs
Edit `hooks/useAuth.ts` and add:
```typescript
console.log("[v0] Auth state changed:", { user, isLoading })
```

Edit `app/analyzer/page.tsx` and add:
```typescript
useEffect(() => {
  console.log("[v0] Auth check:", { user, authLoading })
  if (!authLoading && !user) {
    console.log("[v0] Redirecting to login")
    router.push('/login')
  }
}, [user, authLoading, router])
```

Then remove these logs after verification.

## Common Issues and Solutions

### Issue: Still stuck on login after signup
**Solution**: Make sure `.env.local` has correct Supabase keys
- Check NEXT_PUBLIC_SUPABASE_URL is set
- Check NEXT_PUBLIC_SUPABASE_ANON_KEY is set
- Restart dev server after env changes

### Issue: Redirects to login immediately after signup
**Solution**: Supabase needs email confirmation
- Check your Supabase project settings
- Go to Authentication → Providers
- Disable "Email Confirmation" for development
- Or manually confirm email in Supabase dashboard

### Issue: Session not persisting on page refresh
**Solution**: 
- Check browser cookies in DevTools
- Ensure third-party cookies aren't blocked
- Check Supabase auth settings for session timeout

## Verification Checklist

- [ ] Added 500ms delay in login handler
- [ ] Added 500ms delay in signup handler  
- [ ] Added useEffect to analyzer page
- [ ] useEffect checks `!authLoading && !user`
- [ ] Analyzer returns null if not authenticated
- [ ] Tested signup → analyzer redirect
- [ ] Tested login → analyzer redirect
- [ ] Tested direct /analyzer access
- [ ] Tested session persistence on refresh
- [ ] Verified Sign Out button works
