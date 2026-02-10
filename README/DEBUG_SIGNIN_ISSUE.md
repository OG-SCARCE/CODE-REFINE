# Debugging Sign-In Redirect Issue

## Problem
When signing in, the button shows "Signing in..." but never redirects to the analyzer page.

## Steps to Debug

### 1. Open Browser DevTools
- Press `F12` or right-click → "Inspect" on your browser
- Go to the **Console** tab

### 2. Try Signing In Again
- Fill in your email and password
- Click the "Sign In" button
- Watch the console for log messages

### 3. Look for Console Logs
You should see messages like:
```
[v0] Sign-in attempt with email: your@email.com
[v0] Sign-in response: { error: null, user: {...} }
[v0] User authenticated, redirecting to analyzer: your@email.com
[v0] Navigating to analyzer...
```

### 4. If You See Errors

**Error: "Supabase client not initialized"**
- Check that `.env.local` has all three variables set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Restart the dev server (`npm run dev`)

**Error: "Invalid login credentials"**
- Make sure the email/password combo exists in Supabase
- Check if you created an account with that email
- Try signing up with a new account instead

**Error: "AuthApiError: ... CORS error" or "Network error"**
- Your Supabase URL might be wrong
- Check that `NEXT_PUBLIC_SUPABASE_URL` is correct in `.env.local`
- It should look like: `https://xxxxx.supabase.co`

**No logs appear at all**
- The page might not be loading correctly
- Check for other errors in the console (red messages)
- Try refreshing the page (F5)

### 5. Common Issues

#### Issue: Button gets stuck on "Signing in..."
**Possible causes:**
1. The sign-in request is failing silently → Check console for errors
2. The session isn't being established → This is a Supabase config issue
3. The redirect isn't working → Check if `router.push()` is being called

#### Issue: User is created but not authenticated
- Supabase requires email confirmation on some projects
- Check your Supabase project settings: Settings → Auth → Email Templates
- If "Email Confirmations" is enabled, users need to verify email before login

#### Issue: Redirect works but then redirects back to login
- The `useAuth` hook hasn't updated yet
- This is a timing issue - the analyzer page checks auth before it's set
- Should be fixed by the 800ms delay we added

### 6. Testing Checklist

Before reporting an issue, verify:
- [ ] `.env.local` exists with all 4 Supabase variables
- [ ] Dev server restarted after adding `.env.local`
- [ ] Browser console shows `[v0]` debug logs (not errors)
- [ ] Can sign up and see user created in Supabase dashboard
- [ ] Can sign in with correct credentials
- [ ] Browser console shows "Navigating to analyzer..."

### 7. Next Steps

After trying these steps, share the console logs you see with any errors. This will help us identify the exact issue.

## Quick Test

Try this test account (if you have email access):
```
Email: test@example.com
Password: TestPassword123
```

Create it via the signup form, then try logging in.
