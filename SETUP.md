# SnapDx Development Setup Guide

## 🎯 Current Status

✅ **Sprint 1 Progress:** Foundation setup is partially complete
- [x] Next.js 14 project initialized
- [x] Dependencies installed (Supabase, Tailwind, Framer Motion, Lucide icons)
- [x] Landing page with SnapDx branding created
- [x] Database schema designed
- [ ] Supabase project setup needed
- [ ] Authentication implementation pending
- [ ] Chat interface pending

## 📋 Next Steps

### Step 1: Create Supabase Project (Required Now!)

1. **Go to [supabase.com](https://supabase.com) and create account**

2. **Create new project:**
   - Project name: `snapdx-prod` (or `snapdx-dev` for development)
   - Database password: Choose a strong password (save it!)
   - Region: **ap-south-1 (Mumbai)** - Important for India-based users
   - Pricing tier: Free tier is fine for development

3. **Wait 2-3 minutes for project initialization**

4. **Get your credentials:**
   - Go to Project Settings → API
   - Copy these values:
     - `Project URL` (looks like: https://xxxxx.supabase.co)
     - `anon public` key
     - `service_role` key (keep this secret!)

### Step 2: Configure Environment Variables

1. **Create `.env.local` file in project root:**

```bash
cd /home/ayush/projects/snapdx
cp .env.local.example .env.local
```

2. **Edit `.env.local` and add your Supabase credentials:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Leave these empty for now - we'll add them later
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Run Database Migrations

1. **Open Supabase Dashboard → SQL Editor**

2. **Click "New Query"**

3. **Copy the entire content from:**
   ```
   /home/ayush/projects/snapdx/supabase/migrations/001_initial_schema.sql
   ```

4. **Paste into SQL Editor and click "Run"**

5. **Verify tables created:**
   - Go to Table Editor in Supabase
   - You should see: `profiles`, `chat_sessions`, `messages`, `knowledge_documents`, `usage_logs`

### Step 4: Configure Storage Bucket

1. **Go to Supabase Dashboard → Storage**

2. **Click "Create a new bucket"**

3. **Configure bucket:**
   - Name: `medical-images`
   - Public bucket: **NO** (uncheck this)
   - File size limit: 10 MB
   - Allowed MIME types: `image/jpeg,image/png,application/dicom`

4. **Policies are already created by migration SQL**

### Step 5: Enable Authentication Providers

1. **Go to Authentication → Providers**

2. **Enable Email provider:**
   - Email Auth: ON
   - Confirm email: ON (recommended)

3. **Enable Google OAuth (optional for now):**
   - Get OAuth credentials from Google Cloud Console
   - Add them to Supabase

4. **Configure Auth Settings:**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### Step 6: Test the Setup

1. **Restart dev server:**

```bash
# If server is running, stop it (Ctrl+C) and restart
npm run dev
```

2. **Open browser:** http://localhost:3000

3. **You should see:**
   - ✅ Landing page loads
   - ✅ SnapDx logo and branding
   - ✅ No console errors related to Supabase

## 🚀 What We've Built So Far

### ✅ Completed Components

1. **Project Structure**
   ```
   snapdx/
   ├── app/
   │   ├── layout.tsx       ✅ Root layout with Inter font
   │   ├── page.tsx         ✅ Landing page with full branding
   │   └── globals.css      ✅ Tailwind + custom styles
   ├── lib/
   │   ├── supabase/
   │   │   ├── client.ts    ✅ Browser Supabase client
   │   │   └── server.ts    ✅ Server Supabase client
   │   ├── database.types.ts ✅ TypeScript types
   │   └── utils.ts         ✅ Utility functions (cn)
   ├── supabase/
   │   └── migrations/
   │       └── 001_initial_schema.sql ✅ Complete DB schema
   └── Configuration files   ✅ All configs set up
   ```

2. **Landing Page Features**
   - Hero section with tagline: "From confusion to clarity in a snap"
   - Feature cards (Instant Analysis, Evidence-Based, Smart Learning)
   - How it works section (3-step process)
   - Call-to-action sections
   - Footer with links
   - Educational disclaimer banner
   - Responsive design

3. **Database Schema (Ready to Deploy)**
   - User profiles with medical specialization tracking
   - Chat sessions with tagging and favorites
   - Messages with image support and metadata
   - Knowledge base for RAG with vector embeddings
   - Usage tracking for freemium limits
   - Row Level Security (RLS) policies
   - Automatic triggers and functions

4. **Branding**
   - Primary Color: Electric Blue (#0EA5E9)
   - Accent Color: Amber (#F59E0B)
   - Typography: Inter font family
   - Icons: Lucide React (lightning bolt/Zap icon)

## 🎯 Next Development Tasks

### Task 1: Authentication Pages (Sprint 1 - Remaining)

Create these pages:
- `/app/(auth)/login/page.tsx` - Login form
- `/app/(auth)/signup/page.tsx` - Signup form
- `/app/(auth)/callback/route.ts` - OAuth callback handler
- `components/auth/` - Reusable auth components

### Task 2: Chat Interface (Sprint 1 - Remaining)

Create:
- `/app/dashboard/page.tsx` - Main chat interface
- `components/chat/MessageList.tsx`
- `components/chat/MessageInput.tsx`
- `components/chat/SessionSidebar.tsx`

### Task 3: Session Management (Sprint 1 - Final)

Implement:
- Create new chat session
- List user's sessions
- Switch between sessions
- Delete sessions

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check (useful before committing)
npx tsc --noEmit
```

## 📦 Installed Dependencies

### Core Framework
- `next@latest` - Next.js 14+ with App Router
- `react@latest` - React 18+
- `typescript` - Type safety

### Supabase
- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Server-side rendering support

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library
- `framer-motion` - Animations
- `class-variance-authority` - Component variants
- `clsx` & `tailwind-merge` - Utility merging

## 🔧 Troubleshooting

### "Supabase URL not provided"
- Make sure `.env.local` exists
- Check that env variables start with `NEXT_PUBLIC_` for client-side
- Restart dev server after adding env variables

### "Storage bucket not found"
- Create `medical-images` bucket in Supabase Dashboard
- Make sure it's set to private
- Check storage policies are applied

### Page not loading/white screen
- Check browser console for errors
- Make sure all imports are correct
- Run `npm install` to ensure all dependencies installed

### TypeScript errors
- Run `npx tsc --noEmit` to see all type errors
- Make sure `tsconfig.json` is properly configured
- Check that type definitions are imported

## 📚 Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **PRD:** See `prd.md` for complete product requirements

## 🎉 Ready for Sprint 2?

Once Steps 1-6 above are complete and authentication is working, we can move to:

**Sprint 2: Image Upload & Storage**
- Image upload component with drag-drop
- Image preview with zoom/pan controls
- Automatic EXIF metadata removal
- Display images in chat history

---

**Need help? Check the PRD or create an issue in the repo!**
