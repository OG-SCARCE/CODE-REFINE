# CodeRefine Authentication - Quick Start Guide

## What Changed?

The analyzer feature now requires users to be logged in. All unauthenticated users are automatically redirected to the login/signup page.

## Setup Instructions

### Step 1: Set Environment Variables

Add these to your `.env.local` file:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Get these values from your Supabase project settings.

### Step 2: Run the Application

```bash
npm install
npm run dev
```

The application will start on `http://localhost:3000`

## Testing the Authentication

### Test 1: New User Sign Up
1. Go to `http://localhost:3000`
2. Click "Analyze Code" button
3. Click "Create Account" (or you'll be on signup page)
4. Fill in: Full Name, Email, Password
5. Click "Create Account"
6. You should be redirected to the analyzer

### Test 2: Existing User Login
1. Logout first (click "Sign Out" in analyzer)
2. Click "Analyze Code" button
3. Click "Sign in" link on signup page
4. Enter your email and password
5. Click "Sign In"
6. You should be redirected to the analyzer

### Test 3: Route Protection
1. Go to `http://localhost:3000/analyzer` directly (while logged out)
2. You should be redirected to login page
3. Login and try again
4. Now you can access the analyzer

## User Features

### Navigation Bar (Home Page)
- **Unauthenticated**: Shows "Log In" and "Sign Up" buttons
- **Authenticated**: "Analyze Code" button goes directly to analyzer

### Analyzer Page
- **Sign Out Button**: Click to logout and return to home
- **Back Button**: Returns to home page
- **Full analyzer**: Available when logged in

### Login/Signup Pages
- Email validation
- Password validation (min 6 characters)
- Error messages for failed attempts
- Links to switch between login and signup

## User Experience Flow

```
Landing Page
    ↓
[Unauthenticated] → Click "Analyze Code" → Sign Up / Login
[Authenticated] → Click "Analyze Code" → Analyzer Page

Analyzer Page
    ↓
[Authenticated Only]
    ↓
Click "Sign Out" → Redirect to Home Page
```

## Common Issues & Solutions

### Issue: "Supabase client not initialized"
**Solution**: 
- Check `.env.local` has all three environment variables
- Restart the dev server
- Clear browser cookies

### Issue: Cannot login after signing up
**Solution**:
- In Supabase, check "Disable email confirmations" if you want instant access
- Or check your email for confirmation link

### Issue: Redirected to login even when logged in
**Solution**:
- Clear browser cookies
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check Supabase session is valid

### Issue: Page keeps redirecting
**Solution**:
- Check browser console for errors
- Verify environment variables are correct
- Check Supabase URL is accessible

## Security Features

✅ **Protected Routes**: `/analyzer` requires authentication
✅ **Session Management**: Automatic via Supabase
✅ **Secure Passwords**: Minimum 6 characters, hashed in Supabase
✅ **Email Validation**: Only valid emails accepted
✅ **Logout**: Clears session and redirects to home
✅ **Middleware**: Server-side route protection

## API Endpoints Used

### Authentication
- `POST /auth/v1/signup` - Create new account
- `POST /auth/v1/token?grant_type=password` - Login
- `POST /auth/v1/logout` - Logout
- `GET /auth/v1/user` - Get current user

All handled automatically by Supabase SDK.

## File Structure

```
app/
  ├── analyzer/
  │   └── page.tsx (Protected route)
  ├── login/
  │   └── page.tsx (Supabase integrated)
  ├── signup/
  │   └── page.tsx (Supabase integrated)
  ├── page.tsx (Home page, auth-aware)
  └── layout.tsx

hooks/
  └── useAuth.ts (NEW - Authentication hook)

middleware.ts (NEW - Route protection)

app/app/services/
  └── supabaseClient.ts (Existing - Supabase client)
```

## Next Steps (Optional)

1. **Add Email Verification**: In Supabase settings, enable email verification
2. **Password Reset**: Implement forgot password feature
3. **Social Login**: Add Google/GitHub login
4. **User Profile**: Let users edit their profile
5. **Session Timeout**: Auto-logout after inactivity

## Deployment

When deploying to production:

1. Add environment variables to your hosting platform
2. Ensure Supabase URL is accessible from your domain
3. Update redirect URLs in Supabase settings
4. Test authentication flow on production

## Support

For issues:
1. Check browser console (F12) for errors
2. Check Supabase dashboard for user/auth issues
3. Review logs in your hosting platform
4. See detailed docs in `AUTH_SETUP.md`

---

**You're all set!** Users now need to sign up or login before using the analyzer. 🎉
