# Authentication Testing Guide

## Verification Steps

### 1. Environment Variables Check
Your Supabase integration has these environment variables set:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Frontend can access
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Frontend authentication key
- ✅ `SUPABASE_URL` - Backend URL
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Backend admin key

### 2. Test the Flow

#### Step 1: Start the Dev Server
```bash
npm run dev
```
You should NOT see "Missing Supabase environment variables" error anymore.

#### Step 2: Test Signup Flow
1. Go to `http://localhost:3000`
2. Click "Analyze Code" button
3. You should be redirected to `/signup` (not authenticated)
4. Fill in the signup form:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123
   - Confirm Password: TestPassword123
5. Click "Create Account"
6. You should be redirected to `/analyzer`

#### Step 3: Test Analyzer Protection
1. Open `/analyzer` directly in browser without logging in
2. You should be redirected to `/login`
3. This means the authentication protection is working

#### Step 4: Test Login Flow
1. Go to `/login`
2. Enter credentials from Step 2
3. Click "Sign In"
4. You should be redirected to `/analyzer`
5. You should see a "Sign Out" button in the top right

#### Step 5: Test Logout
1. While on `/analyzer`, click "Sign Out"
2. You should be redirected to home page `/`
3. Session should be cleared

### 3. Common Issues & Solutions

#### Issue: "Missing Supabase environment variables"
**Solution:** This should now be fixed. The supabaseClient.ts now:
- Uses `NEXT_PUBLIC_SUPABASE_URL` (not `SUPABASE_URL`) for client-side
- Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not `SUPABASE_SERVICE_ROLE_KEY`) for client-side
- Only throws error if these specific keys are missing

#### Issue: Signup/Login not working
**Possible causes:**
1. Check browser console for errors
2. Check Supabase project - ensure auth is enabled
3. Verify the email format is valid
4. Password must be at least 6 characters

#### Issue: Can access `/analyzer` without login
**Solution:** Clear browser cache and hard refresh (Ctrl+Shift+R)

### 4. Browser DevTools Debugging

Open your browser's Developer Tools (F12) and check:

**Console tab:**
- Look for any JavaScript errors
- Should see auth state messages

**Application > Cookies:**
- Should see Supabase session cookies after login
- Cookies should be deleted after logout

**Network tab:**
- During signup/login, you should see requests to Supabase API
- Should see `auth/v1/signup` or `auth/v1/token` endpoints

### 5. Files Modified to Fix the Issue

1. **`app/app/services/supabaseClient.ts`** - Fixed environment variable names
2. **`app/login/page.tsx`** - Added proper Supabase import and removed dynamic import
3. **`app/signup/page.tsx`** - Added proper Supabase import and removed dynamic import
4. **`hooks/useAuth.ts`** - Already correct (no changes needed)
5. **`app/analyzer/page.tsx`** - Already correct (no changes needed)

### 6. Success Indicators

✅ Dev server starts without "Missing Supabase" error
✅ Can access home page (`/`)
✅ Unauthenticated users can't access `/analyzer` (redirected to `/login`)
✅ Can sign up with new email
✅ Can log in with existing credentials
✅ Can log out and return to home page
✅ "Sign Out" button appears in analyzer for authenticated users

## Next Steps

If you encounter any issues:
1. Check the browser console (F12 → Console tab)
2. Check the Network tab for failed API requests
3. Verify your Supabase project settings
4. Ensure email verification is set correctly in Supabase (if required)
