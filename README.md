# SnapDx - Instant Orthopedic Insights

AI-powered educational platform for medical students and orthopedic residents. Upload X-rays, get AI analysis, and master fracture classifications faster.

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI:** Claude 3.5 Sonnet (Anthropic), OpenAI Embeddings
- **Deployment:** Vercel (Frontend), Supabase (Backend)

## 🏗️ Project Structure

```
snapdx/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   └── globals.css      # Global styles
├── components/          # React components
├── lib/                 # Utility functions
│   ├── supabase/        # Supabase clients
│   ├── database.types.ts # Database types
│   └── utils.ts         # Helper functions
├── supabase/            # Supabase configurations
│   └── migrations/      # Database migrations
└── public/              # Static assets
```

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/ayushmishra206/snapdx.git
cd snapdx
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Choose **Mumbai (ap-south-1)** region for lower latency in India
3. Go to Project Settings → API to get your credentials

### 4. Configure environment variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run database migrations

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the content from `supabase/migrations/001_initial_schema.sql`
3. Click "Run" to create all tables and policies

### 6. Configure Supabase Storage

1. Go to Storage → Create Bucket
2. Create a bucket named `medical-images`
3. Make it **private** (not public)
4. The RLS policies from the migration will handle access control

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Development Roadmap

### ✅ Sprint 1: Foundation (Completed)
- [x] Next.js project setup
- [x] Supabase integration
- [x] Authentication system
- [x] Landing page with branding
- [x] Basic chat UI

### 🚧 Sprint 2: Image Upload & Storage (Current)
- [ ] Supabase Storage bucket configuration
- [ ] Image upload component
- [ ] Image preview with zoom/pan
- [ ] Metadata stripping
- [ ] Display images in chat

### 🔜 Upcoming Sprints
- Sprint 3: AI Vision Integration
- Sprint 4: RAG Knowledge Base
- Sprint 5: Advanced Features
- Sprint 6: DICOM Support
- Sprint 7: Polish & Launch

See `prd.md` for complete roadmap.

## 🔒 Security & Compliance

- **Educational Tool Only:** Not a medical device
- **Row Level Security:** All data isolated per user
- **Metadata Stripping:** Automatic EXIF removal from images
- **DPDP Compliant:** Data privacy regulations followed
- **Persistent Disclaimers:** Educational use warnings on all pages

## 📚 Key Features

- **Snap Upload™:** Instant X-ray/CT analysis
- **Smart Chat:** Conversational learning with AI
- **Knowledge Hub:** RAG-powered responses citing medical literature
- **Case Management:** Save and organize cases
- **Confidence Scoring:** AI provides transparency on accuracy

## 🤝 Contributing

This is a solo project in active development. Contributions welcome after MVP launch!

## 📄 License

Proprietary - All rights reserved.

## ⚠️ Medical Disclaimer

**SnapDx is for educational purposes only and is NOT a medical device.** Do not use for clinical diagnosis or treatment decisions. Always consult qualified healthcare professionals for medical advice.

## 📧 Contact

- **Developer:** Ayush Mishra
- **GitHub:** [@ayushmishra206](https://github.com/ayushmishra206)
- **Project:** [github.com/ayushmishra206/snapdx](https://github.com/ayushmishra206/snapdx)

---

**Built with ❤️ for medical education in India**
