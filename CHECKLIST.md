# SnapDx Sprint 1 - Development Checklist

## ✅ Completed Tasks

### Project Foundation
- [x] Next.js 14 project initialized with TypeScript
- [x] Tailwind CSS configured with custom SnapDx theme
- [x] Supabase client libraries installed
- [x] Project structure created
- [x] Git repository initialized

### Landing Page
- [x] Responsive landing page created
- [x] SnapDx branding implemented (Electric Blue + Amber colors)
- [x] Hero section with tagline
- [x] Features section (3 key features)
- [x] How It Works section (3-step process)
- [x] CTA sections
- [x] Footer with navigation links
- [x] Educational disclaimer banner
- [x] Mobile responsive design

### Database Design
- [x] Complete database schema designed
- [x] Migration SQL file created (`001_initial_schema.sql`)
- [x] Row Level Security policies defined
- [x] Vector extension setup for RAG
- [x] Storage bucket policies defined
- [x] TypeScript types generated

### Configuration
- [x] TypeScript configuration
- [x] Tailwind configuration with custom colors
- [x] PostCSS configuration
- [x] Next.js configuration
- [x] Environment variables template
- [x] .gitignore file

### Documentation
- [x] README.md with complete project overview
- [x] SETUP.md with detailed setup instructions
- [x] PRD.md (Product Requirements Document)
- [x] This checklist file

---

## 🚧 In Progress

### Supabase Setup (ACTION REQUIRED)
- [ ] **Create Supabase project** (ap-south-1 Mumbai region)
- [ ] **Configure environment variables** in `.env.local`
- [ ] **Run database migrations** via SQL Editor
- [ ] **Create storage bucket** named `medical-images`
- [ ] **Enable authentication providers** (Email + Google OAuth)

**See SETUP.md for detailed instructions on these steps**

---

## 📝 TODO - Sprint 1 (Remaining)

### Authentication System
- [ ] Create auth layout: `app/(auth)/layout.tsx`
- [ ] Build login page: `app/(auth)/login/page.tsx`
  - Email/password login form
  - "Sign in with Google" button
  - Link to signup page
  - "Forgot password" link
- [ ] Build signup page: `app/(auth)/signup/page.tsx`
  - Registration form (email, password, full name)
  - Medical specialization dropdown
  - Institution field
  - Year of study
  - Terms acceptance checkbox
  - Google OAuth option
- [ ] Create OAuth callback: `app/auth/callback/route.ts`
- [ ] Build auth context provider: `components/providers/AuthProvider.tsx`
- [ ] Create protected route middleware: `middleware.ts`

### Chat Interface (Basic)
- [ ] Create dashboard layout: `app/dashboard/layout.tsx`
  - Sidebar for sessions
  - Main chat area
  - User profile dropdown
- [ ] Build session list: `components/chat/SessionList.tsx`
  - Display user's chat sessions
  - "New Case" button
  - Session title and timestamp
  - Delete session button
- [ ] Create message list: `components/chat/MessageList.tsx`
  - Display messages in session
  - Differentiate user vs AI messages
  - Timestamp for each message
  - Empty state when no messages
- [ ] Build message input: `components/chat/MessageInput.tsx`
  - Text input field
  - Send button
  - Character counter (optional)
- [ ] Create session API routes:
  - `app/api/sessions/route.ts` - GET (list), POST (create)
  - `app/api/sessions/[id]/route.ts` - GET (single), DELETE
  - `app/api/messages/route.ts` - POST (send message)

### UI Components (Reusable)
- [ ] Button component: `components/ui/button.tsx`
- [ ] Input component: `components/ui/input.tsx`
- [ ] Card component: `components/ui/card.tsx`
- [ ] Avatar component: `components/ui/avatar.tsx`
- [ ] Dropdown component: `components/ui/dropdown.tsx`
- [ ] Toast/notification system: `components/ui/toast.tsx`
- [ ] Loading spinner: `components/ui/spinner.tsx`
- [ ] Disclaimer banner: `components/ui/disclaimer.tsx`

---

## 🎯 Sprint 1 Definition of Done

Before moving to Sprint 2, ensure:

1. **User can sign up and login**
   - Email/password authentication works
   - Google OAuth works
   - User profile is created automatically
   - Session persists across page refreshes

2. **User can create and manage chat sessions**
   - Create new session
   - View list of sessions
   - Switch between sessions
   - Delete sessions

3. **User can send text messages**
   - Type and send messages
   - Messages are saved to database
   - Messages appear in chat UI
   - User and assistant messages are visually distinct

4. **Protected routes work**
   - Unauthenticated users redirected to login
   - Dashboard only accessible when logged in
   - Landing page accessible to all

5. **Basic error handling**
   - Form validation on login/signup
   - Error messages for failed auth
   - Error messages for API failures
   - Loading states during async operations

---

## 💡 Development Tips

### Testing Authentication
```bash
# Test user creation
1. Go to /signup
2. Fill form and submit
3. Check Supabase Dashboard → Authentication → Users
4. Verify user appears
5. Check Table Editor → profiles → Verify profile created
```

### Testing Chat
```bash
# Test session creation
1. Login to dashboard
2. Click "New Case"
3. Check Supabase → chat_sessions table
4. Verify user_id matches logged-in user
5. Send a message
6. Check messages table
```

### Debugging Supabase RLS
```sql
-- Test RLS policies in Supabase SQL Editor
-- Run as authenticated user (change UUID)
set request.jwt.claims.sub = 'user-uuid-here';

-- Try to query
select * from profiles;
select * from chat_sessions;
```

### Environment Variables
Remember:
- `NEXT_PUBLIC_*` = accessible in browser (client components)
- Without `NEXT_PUBLIC_` = server-only (API routes, server components)
- Restart dev server after changing `.env.local`

---

## 📊 Progress Tracker

**Sprint 1 Completion: ~40%**

| Task Category | Completed | Total | %   |
|---------------|-----------|-------|-----|
| Project Setup | 5/5       | 5     | 100%|
| Landing Page  | 1/1       | 1     | 100%|
| Supabase Config| 0/5      | 5     | 0%  |
| Authentication| 0/8       | 8     | 0%  |
| Chat Interface| 0/6       | 6     | 0%  |
| UI Components | 0/8       | 8     | 0%  |

**Next Priority:** Complete Supabase Setup (5 tasks)

---

## 🚀 Ready to Continue?

1. **First time setup?** → Follow SETUP.md Steps 1-6
2. **Supabase configured?** → Start with authentication pages
3. **Need help?** → Check PRD.md for detailed requirements
4. **Want to contribute?** → Pick a task from TODO section above

**Estimated Time to Complete Sprint 1:** 8-12 hours of focused development

---

## 📞 Questions?

- Architecture decisions → See `prd.md` Section 4 (Technical Architecture)
- UI/UX guidelines → See `prd.md` Section 1 (Brand Identity)
- Database schema → See `supabase/migrations/001_initial_schema.sql`
- Sprint plan → See `prd.md` Section 7 (Implementation Roadmap)

---

**Happy Coding! 🎉**
