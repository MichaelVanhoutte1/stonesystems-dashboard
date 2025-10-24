# Dashboard with Supabase Authentication

A simple Next.js dashboard application with Supabase authentication.

## Features

- User authentication (sign up, sign in, sign out)
- Protected dashboard route
- Clean navbar with user avatar and logout functionality
- Automatic redirects based on authentication status

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Get your Supabase credentials:**

   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Create a new project or select an existing one
   - Go to Settings → API
   - Copy the Project URL and anon public key

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How it works

- **Unauthenticated users** see a login/signup form
- **Authenticated users** are automatically redirected to `/dashboard`
- The dashboard page is protected and requires authentication
- Users can sign out using the navbar dropdown

## Project Structure

```
app/
├── dashboard/
│   └── page.tsx          # Protected dashboard page
├── layout.tsx            # Root layout with AuthProvider
└── page.tsx              # Login/signup page

components/
├── AuthForm.tsx          # Login/signup form
└── Navbar.tsx            # Navigation with user avatar

contexts/
└── AuthContext.tsx       # Authentication context and provider

lib/
├── supabase.ts           # Supabase client configuration
└── supabase-utils.ts     # Authentication utility functions
```
