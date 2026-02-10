# Environment Variables Setup Guide

## How to Get Your Supabase Credentials

### Step 1: Go to Supabase Dashboard
1. Visit [https://app.supabase.com](https://app.supabase.com)
2. Sign in with your account
3. Select your project

### Step 2: Find Your Credentials

#### NEXT_PUBLIC_SUPABASE_URL
1. Click on **Settings** (bottom left)
2. Click on **API**
3. Copy the **Project URL** value
4. Paste it in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
1. In the same **Settings > API** page
2. Under **Project API keys**, find the **anon** (public) key
3. Copy the **Key** value
4. Paste it in `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### SUPABASE_SERVICE_ROLE_KEY
1. In the same **Settings > API** page
2. Under **Project API keys**, find the **service_role** key
3. Copy the **Key** value (keep this SECRET!)
4. Paste it in `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

#### SUPABASE_URL
1. Use the same **Project URL** from Step 2
2. Paste it in `.env.local` as `SUPABASE_URL`

## Security Note
- `.env.local` is in `.gitignore` and should NEVER be committed
- `SUPABASE_SERVICE_ROLE_KEY` is secret - never share or expose it
- `NEXT_PUBLIC_` variables are safe to expose (they're sent to the browser)

## Example .env.local
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://abcdefghij.supabase.co
```

## Test Your Setup
1. Save the `.env.local` file
2. Run `npm run dev`
3. You should see no environment variable errors
4. Try signing up at `/signup`
5. Verify you can log in and access `/analyzer`

## Still Having Issues?
- Make sure `.env.local` is in the **root project directory** (same level as `package.json`)
- Restart your dev server after updating `.env.local` (press Ctrl+C and run `npm run dev` again)
- Check that all four variables are filled in with valid values
- Verify there are no extra spaces or typos in the variable names
