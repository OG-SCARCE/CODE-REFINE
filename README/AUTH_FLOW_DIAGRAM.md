# Authentication Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                       CodeRefine Application                      │
│                     Authentication Flow Diagram                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     1. UNAUTHENTICATED STATE                     │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │  Home Page (/)   │
    └────────┬─────────┘
             │
      ┌──────┴─────────────────────────┐
      │                                │
      ▼                                ▼
┌───────────────┐               ┌──────────────┐
│  "Analyze     │               │   "Log In"   │
│   Code" CTA   │               │    Button    │
└───────┬───────┘               └──────┬───────┘
        │                              │
        ▼                              ▼
   ┌─────────────┐           ┌──────────────┐
   │  Sign Up    │           │   Login      │
   │  Page       │           │   Page       │
   └─────────────┘           └──────────────┘
        │                           │
        └───────────────┬───────────┘
                        ▼
        ┌──────────────────────────┐
        │  Validate Credentials    │
        │  - Email format          │
        │  - Password length       │
        │  - Required fields       │
        └──────────┬───────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────┐           ┌────────┐
   │ Success │           │ Error  │
   └────┬────┘           └────┬───┘
        │                     │
        ▼                     ▼
   Call Supabase         Show Error
   auth.signUp()         Message
   or signIn()               │
        │                    │
        ├─── Error ──────────┘
        │
        ▼
   ┌─────────────────┐
   │  Session Created│
   │  (Supabase)     │
   └────────┬────────┘
            │
            ▼
      ┌───────────────┐
      │ Redirect to   │
      │ /analyzer     │
      └───────┬───────┘
              │
              ▼

┌─────────────────────────────────────────────────────────────────┐
│                  2. AUTHENTICATED STATE                          │
└─────────────────────────────────────────────────────────────────┘

      ┌──────────────────┐
      │  Home Page (/)   │
      │  (Logged In)     │
      └────────┬─────────┘
               │
        ┌──────┴──────────┐
        │                 │
        ▼                 ▼
   ┌──────────────┐  ┌──────────────┐
   │ "Analyze     │  │ "Log Out"    │
   │  Code" → /   │  │  Button      │
   │  analyzer    │  │              │
   └──────┬───────┘  └──────┬───────┘
          │                 │
          ▼                 ▼
    ┌────────────┐    ┌──────────────┐
    │  Analyzer  │    │ Call logout()│
    │  Page      │    │              │
    │ (Full UI)  │    └──────┬───────┘
    │            │           │
    │ - Code     │           ▼
    │   Input    │    ┌──────────────┐
    │ - Upload   │    │ Sign Out     │
    │ - Analyze  │    │ (Supabase)   │
    │ - Results  │    └──────┬───────┘
    │ - Sign Out │           │
    │   Button   │           ▼
    └────────────┘    ┌──────────────┐
                      │ Session      │
                      │ Cleared      │
                      └──────┬───────┘
                             │
                             ▼
                      ┌──────────────┐
                      │ Redirect to  │
                      │ /            │
                      │ (Home page)  │
                      └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                3. ROUTE PROTECTION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

User Tries Direct Access: /analyzer

        ▼
┌──────────────────┐
│  Middleware Check│
│  (Server-side)   │
└────────┬─────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌────────┐  ┌────────┐
│Session │  │Session │
│Valid?  │  │Missing?│
└───┬────┘  └───┬────┘
    │           │
    ▼           ▼
┌────────┐  ┌──────────────┐
│ Allow  │  │ Redirect to  │
│ Access │  │ /login       │
└────────┘  └──────────────┘


Then useAuth() Check (Client-side)

        ▼
┌──────────────────┐
│ useAuth() Hook   │
│ (Client-side)    │
└────────┬─────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌────────┐  ┌────────┐
│Loading │  │Checking│
│ State  │  │Session │
└────────┘  └────┬───┘
                 │
            ┌────┴────┐
            │          │
            ▼          ▼
        ┌────────┐  ┌────────┐
        │ User   │  │ No User│
        │ Found  │  │ Found  │
        └───┬────┘  └───┬────┘
            │           │
            ▼           ▼
        ┌────────┐  ┌────────────┐
        │ Render │  │ Redirect to│
        │Page    │  │ /login     │
        └────────┘  └────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                4. SESSION MANAGEMENT                             │
└─────────────────────────────────────────────────────────────────┘

Session Lifecycle:

    Sign Up / Login
           │
           ▼
    ┌────────────────┐
    │ Supabase Creates│
    │ Session        │
    │ - JWT Token    │
    │ - Refresh Token│
    └────────┬───────┘
             │
             ▼
    ┌────────────────────┐
    │ Store in Cookies   │
    │ (Secure, HttpOnly) │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ useAuth() Listens  │
    │ to Changes         │
    └────────┬───────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
 Active Session   Sign Out
    │                 │
    ▼                 ▼
 Render Pages    Clear Session
 with User ID    Delete Cookies
                 Redirect to Home

┌─────────────────────────────────────────────────────────────────┐
│              5. ERROR HANDLING FLOW                              │
└─────────────────────────────────────────────────────────────────┘

User Submits Form

        ▼
    ┌────────────────────┐
    │ Client Validation  │
    │ - Check fields     │
    │ - Validate email   │
    │ - Check password   │
    └────────┬───────────┘
             │
        ┌────┴────┐
        │          │
        ▼          ▼
    ┌────────┐  ┌────────┐
    │ Valid  │  │Invalid │
    └───┬────┘  └───┬────┘
        │           │
        ▼           ▼
   Call API     Show Error
        │        Message
        ▼
    ┌────────────────────┐
    │ Supabase Response   │
    └────────┬───────────┘
             │
        ┌────┴────┐
        │          │
        ▼          ▼
    ┌────────┐  ┌────────┐
    │Success │  │ Error  │
    └───┬────┘  └───┬────┘
        │           │
        ▼           ▼
   Create Session Show Error
   Update useAuth() Stay on Form
   Redirect        Allow Retry

┌─────────────────────────────────────────────────────────────────┐
│         6. COMPONENT INTERACTION FLOW                            │
└─────────────────────────────────────────────────────────────────┘

Home Page (page.tsx)
    │
    ├─ useAuth() Hook
    │   └─ Check user state
    │
    ├─ "Analyze Code" Button
    │   └─ If user → /analyzer
    │   └─ If !user → /signup
    │
    └─ "Log In" Button
        └─ Navigate to /login


Sign Up Page (signup/page.tsx)
    │
    ├─ Form Fields
    │   ├─ Full Name
    │   ├─ Email
    │   ├─ Password
    │   └─ Confirm Password
    │
    ├─ Validation
    │   └─ Check all fields
    │
    ├─ Submit Handler
    │   └─ supabase.auth.signUp()
    │
    └─ Error Display
        └─ Show error message


Analyzer Page (analyzer/page.tsx)
    │
    ├─ useAuth() Hook
    │   ├─ Check session
    │   ├─ Loading state
    │   └─ Redirect if !user
    │
    ├─ Sign Out Button
    │   └─ logout() function
    │
    └─ Analyzer UI
        ├─ Code Input
        ├─ Upload
        ├─ Analyze
        └─ Results

┌─────────────────────────────────────────────────────────────────┐
│          Legend & Key Information                                │
└─────────────────────────────────────────────────────────────────┘

Key Files:
  • hooks/useAuth.ts - Auth hook with session check
  • middleware.ts - Server-side route protection
  • app/login/page.tsx - Login integration
  • app/signup/page.tsx - Signup integration
  • app/analyzer/page.tsx - Protected analyzer page
  • app/page.tsx - Home page with auth-aware buttons

Protected Routes:
  ✓ /analyzer - Requires authentication

Public Routes:
  ✓ / - Home page (has CTA for auth)
  ✓ /login - Login page
  ✓ /signup - Signup page

Session Storage:
  • Cookies - Secure, HttpOnly cookies from Supabase
  • Memory - useAuth hook tracks current session
  • Middleware - Validates session on server

Authentication Methods:
  • Email/Password signup
  • Email/Password login
  • Session management via Supabase
  • Logout clears all sessions

Flow Summary:
  1. User accesses app
  2. Home page checks authentication status
  3. Unauthenticated users see signup/login CTAs
  4. Clicking "Analyze Code" routes to signup if not logged in
  5. User creates account or logs in
  6. Session created and stored in secure cookies
  7. User redirected to analyzer
  8. Analyzer page checks authentication
  9. useAuth() renders page content if authenticated
  10. Sign Out button clears session and redirects
