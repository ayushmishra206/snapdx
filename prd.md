Perfect choice! **SnapDx** has great energy - the double meaning (fracture "snap" + instant diagnosis) is 🔥. Let me integrate it fully into the PRD:

---

# **Product Requirement Document (PRD): SnapDx**
*Instant Orthopedic Insights*

**Version:** 2.0  
**Status:** Ready for Development  
**Date:** January 13, 2026  
**Target Market:** India (Medical Students & Residents)  
**Positioning:** Educational orthopedic assistant for rapid learning and case analysis

---

## 1. Product Overview

**SnapDx** is an AI-powered educational platform that helps medical students and orthopedic residents instantly analyze fractures, understand classification systems, and learn evidence-based management protocols through multimodal chat and image analysis.

### 1.1 Brand Identity

**Name Origin:**
- **"Snap"** → The sound of a fracture + instant/rapid diagnosis
- **"Dx"** → Medical abbreviation for diagnosis

**Brand Promise:** "From confusion to clarity in a snap"

**Visual Identity:**
- **Primary Color:** Electric Blue (#0EA5E9) - Trust, medical, technology
- **Accent Color:** Amber (#F59E0B) - Energy, learning, caution (for disclaimers)
- **Logo Concept:** Stylized bone with a lightning bolt fracture line forming the "snap"

**Tagline Options:**
- "Instant orthopedic insights" (Primary)
- "Learn faster, diagnose smarter"
- "Your AI orthopedic companion"

---

## 2. Target Audience & User Personas

### Primary Persona: **"Residency Rohan"**
- **Age:** 26, 2nd-year Orthopedic Resident
- **Pain Points:** Limited time, needs quick reference during rounds, wants to verify differential diagnoses
- **Goals:** Pass board exams, become confident in fracture classification
- **SnapDx Usage:** Uploads X-rays from morning rounds, asks "What's the AO classification?" during lunch breaks

### Secondary Persona: **"Medical Student Priya"**
- **Age:** 23, Final year MBBS
- **Pain Points:** Overwhelmed by ortho rotation, textbooks are dense, needs visual learning
- **Goals:** Understand basics fast, perform well in OSCEs
- **SnapDx Usage:** Studies case images at night, practices identifying fracture patterns

### Tertiary Persona: **"GP Gagan"**
- **Age:** 35, General Practitioner in Tier-2 city
- **Pain Points:** No orthopedic backup nearby, needs quick guidance before referring
- **Goals:** Provide better first-line care, know when to refer urgently
- **SnapDx Usage:** Quick consultation tool for fracture assessment (educational disclaimer applies)

---

## 3. Core Features (MVP)

### 3.1 **Snap Upload™** - Instant Image Analysis
**User Flow:**
1. Click "New Case" → Upload image (drag-drop or camera)
2. Optional: Add context ("23F, RTA, wrist pain")
3. AI analyzes in 3-5 seconds
4. Results show: Fracture presence, classification, confidence score

**Supported Formats:**
- JPG, PNG (X-rays, CT scans, MRI)
- DICOM (Phase 2) - for advanced users

**Key Features:**
- **Real-time preview** with zoom/pan controls
- **Metadata stripping** for privacy (automatic)
- **Comparison view** (upload 2 images side-by-side for progress tracking)

### 3.2 **Smart Chat Interface**
**Conversational Learning:**
```
Student: "What fracture is this?"
SnapDx: "This appears to be a Distal Radius Fracture (Colles' type) 
        with dorsal angulation. Confidence: 92%
        
        📚 Key Learning Points:
        • Most common wrist fracture in adults
        • Usually from FOOSH (Fall On Outstretched Hand)
        • AO/OTA Classification: 23-A2
        
        Want to know about management options?"
```

**Features:**
- Follow-up questions in context
- Citation of sources (textbooks, guidelines)
- "Teach me more" button to dive deeper
- Save important conversations to "My Cases"

### 3.3 **Knowledge Hub** (RAG-Powered)
**Pre-loaded Medical Knowledge:**
- Campbell's Operative Orthopaedics (key chapters)
- AO/OTA Classification System
- AAOS Clinical Practice Guidelines
- Common complication rates & outcomes data

**Smart Retrieval:**
- When you ask about "ORIF complications," SnapDx searches its knowledge base before responding
- Always cites sources: "According to Campbell's 14th Ed., Chapter 54..."
- No hallucinations: If answer isn't in knowledge base → "I don't have verified information on this specific topic"

### 3.4 **Educational Guardrails**
Every screen has a persistent banner:
```
⚠️ Educational Tool Only
SnapDx is for learning purposes and is NOT a medical device. 
Do not use for clinical diagnosis or treatment decisions. 
Always consult a qualified healthcare professional.
```

**Additional Safety:**
- "Confidence Score" shown for all AI outputs
- "Why this classification?" explanation available
- "Report incorrect result" button for continuous improvement

---

## 4. Technical Architecture

### 4.1 Full Stack Overview

```
┌─────────────────────────────────────────────┐
│     Frontend: SnapDx Web App (Next.js)       │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  UI Components (shadcn/ui)              │ │
│  │  • Chat interface with image preview    │ │
│  │  • DICOM viewer (Cornerstone.js)        │ │
│  │  • Case gallery & saved conversations   │ │
│  └────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│        Supabase Backend Platform             │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Supabase Auth                           │ │
│  │ • Email/Password + Google OAuth         │ │
│  │ • Magic links for passwordless          │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Supabase Database (PostgreSQL)          │ │
│  │ Tables: profiles, chat_sessions,        │ │
│  │         messages, knowledge_documents   │ │
│  │ Extensions: pgvector for RAG            │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Supabase Storage (S3-compatible)        │ │
│  │ Buckets: medical-images (private)       │ │
│  │ Security: Row Level Security policies   │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Supabase Edge Functions (Deno)          │ │
│  │ • image-preprocessing                   │ │
│  │ • dicom-metadata-strip                  │ │
│  │ • ai-orchestrator                       │ │
│  └────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│          AI Services Layer                   │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Vision + Language Model                 │ │
│  │ Primary: Claude 3.5 Sonnet (Anthropic)  │ │
│  │ • Native multimodal (image + text)      │ │
│  │ • Best reasoning for medical context    │ │
│  │ • HIPAA-compliant on AWS                │ │
│  │                                         │ │
│  │ Fallback: GPT-4o (OpenAI/Azure)         │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ RAG System (Retrieval-Augmented Gen)    │ │
│  │ • Embeddings: text-embedding-3-small    │ │
│  │ • Vector Store: Supabase pgvector       │ │
│  │ • Semantic search → LLM → Response      │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 4.2 Detailed Tech Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend Framework** | Next.js 14 (App Router) + TypeScript | Server components, great DX, Vercel deployment |
| **UI Components** | shadcn/ui + Tailwind CSS + Framer Motion | Beautiful, accessible, animated |
| **Medical Image Viewer** | Cornerstone.js (Phase 2) | Industry standard for DICOM rendering |
| **State Management** | React Context + Zustand (for complex state) | Simple for MVP, scalable |
| **Backend Platform** | **Supabase** (Database + Auth + Storage + Functions) | All-in-one, excellent free tier, scales easily |
| **Database** | PostgreSQL (via Supabase) | Reliable, mature, great JSON support |
| **Vector Database** | pgvector extension (in Supabase) | Native to Postgres, no separate service |
| **File Storage** | Supabase Storage | S3-compatible, integrated with RLS |
| **Authentication** | Supabase Auth | Built-in, supports OAuth, MFA ready |
| **Serverless Functions** | Supabase Edge Functions (Deno) | Fast, globally distributed |
| **AI Model** | **Claude 3.5 Sonnet** (via Anthropic API) | Best multimodal reasoning for medical imaging |
| **Embeddings** | OpenAI text-embedding-3-small | Cost-effective, good quality for RAG |
| **AI Orchestration** | LangChain (optional) or direct API calls | Simplifies prompt chaining and RAG |
| **Deployment** | Vercel (Frontend) + Supabase (Backend) | Zero-config CI/CD, automatic HTTPS |
| **Monitoring** | Sentry (errors) + Supabase Analytics | Track bugs and usage patterns |

---

## 5. Database Schema (Supabase PostgreSQL)

```sql
-- Enable UUID and vector extensions
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- User profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  institution text, -- Medical school or hospital
  year_of_study int, -- 1 = 1st year, 2 = 2nd year, etc.
  specialization text, -- 'ortho_resident', 'medical_student', 'gp'
  avatar_url text,
  usage_count int default 0, -- Track free tier limits
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Row Level Security
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Chat sessions (cases)
create table public.chat_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text default 'Untitled Case', -- Auto-generated from first message
  case_tags text[], -- ['fracture', 'distal_radius', 'colles']
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.chat_sessions enable row level security;

create policy "Users can CRUD own sessions"
  on chat_sessions for all
  using (auth.uid() = user_id);

-- Messages within a chat session
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  image_url text, -- Supabase Storage URL if image attached
  metadata jsonb default '{}'::jsonb, -- { confidence: 0.92, classification: "AO-23A2", sources: [...] }
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.messages enable row level security;

create policy "Users can view messages in own sessions"
  on messages for select
  using (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

create policy "Users can insert messages in own sessions"
  on messages for insert
  with check (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

-- Medical knowledge base (for RAG)
create table public.knowledge_documents (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null, -- Chunked text from medical literature
  source text not null, -- "Campbell's Orthopaedics 14th Ed., Chapter 54"
  category text, -- 'fracture_classification', 'management', 'complications'
  embedding vector(1536), -- OpenAI embedding dimension
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create index for fast vector similarity search
create index on knowledge_documents 
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Public read access for knowledge (no RLS needed for public content)
alter table public.knowledge_documents enable row level security;

create policy "Knowledge is publicly readable"
  on knowledge_documents for select
  to authenticated
  using (true);

-- Usage tracking (for freemium limits)
create table public.usage_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  action_type text not null, -- 'image_analysis', 'chat_message'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.usage_logs enable row level security;

create policy "Users can view own usage"
  on usage_logs for select
  using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for auto-updating timestamps
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_chat_sessions_updated_at before update on chat_sessions
  for each row execute procedure update_updated_at_column();
```

---

## 6. Supabase Storage Configuration

```typescript
// Storage bucket structure
buckets:
  - medical-images (private)
    └── {user_id}/
        └── {session_id}/
            └── {image_id}.jpg

// Security policy for medical-images bucket
create policy "Users can upload own images"
  on storage.objects for insert
  with check (
    bucket_id = 'medical-images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view own images"
  on storage.objects for select
  using (
    bucket_id = 'medical-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own images"
  on storage.objects for delete
  using (
    bucket_id = 'medical-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 7. Implementation Roadmap

### **Sprint 1: Foundation (Week 1-2)** 
**Goal:** Get basic authentication and chat working

- [x] Set up Next.js 14 project with TypeScript
- [x] Configure Supabase project (Mumbai region)
- [x] Implement Supabase Auth (Email + Google OAuth)
- [x] Create database schema and run migrations
- [x] Build landing page with SnapDx branding
- [x] Create basic chat UI (message list + input)
- [x] Implement session management (create/list/delete)

**Deliverable:** Users can sign up, create a chat, and send text messages

---

### **Sprint 2: Image Upload & Storage (Week 3)** 
**Goal:** Users can upload medical images securely

- [ ] Configure Supabase Storage bucket (`medical-images`)
- [ ] Implement Row Level Security policies
- [ ] Build image upload component (drag-drop + file picker)
- [ ] Create image preview with zoom/pan controls
- [ ] Add automatic metadata stripping (EXIF removal)
- [ ] Display uploaded images in chat history

**Deliverable:** Users can upload X-ray images and see them in chat

---

### **Sprint 3: AI Integration - Vision Model (Week 4)**  
**Goal:** AI can analyze images and respond

- [ ] Set up Anthropic API (Claude 3.5 Sonnet)
- [ ] Create Supabase Edge Function: `ai-orchestrator`
- [ ] Send image + user question to Claude
- [ ] Parse AI response and extract:
  - Main answer
  - Confidence score
  - Classification codes (if applicable)
- [ ] Display AI response with proper formatting
- [ ] Add "Analyzing..." loading state with skeleton UI

**Deliverable:** Users get AI-powered analysis of uploaded images

---

### **Sprint 4: RAG Knowledge Base (Week 5-6)**  
**Goal:** AI responses cite medical literature

**Tasks:**
- [ ] Collect orthopedic guidelines (PDFs/docs):
  - AO/OTA Classification manual
  - Key chapters from Campbell's (fair use excerpts)
  - AAOS Clinical Practice Guidelines
- [ ] Chunk documents into 500-1000 token segments
- [ ] Generate embeddings using OpenAI API
- [ ] Insert into `knowledge_documents` table with pgvector
- [ ] Implement semantic search function:
  ```typescript
  async function searchKnowledge(query: string, limit = 5) {
    const embedding = await getEmbedding(query);
    const { data } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: limit
    });
    return data;
  }
  ```
- [ ] Modify AI prompt to include retrieved context
- [ ] Add citation display: "Source: Campbell's Ch. 54"

**Deliverable:** AI responses are grounded in medical literature with citations

---

### **Sprint 5: Advanced Features (Week 7)**  
**Goal:** Polish the core experience

- [ ] **Confidence Scoring UI:**
  - Visual indicator (progress bar)
  - Color-coded: Green (>90%), Yellow (70-90%), Red (<70%)
- [ ] **Case Management:**
  - Rename sessions
  - Add to favorites
  - Tag cases (auto-suggest tags from AI)
- [ ] **"Teach Me More" Feature:**
  - Button to dive deeper into a topic
  - Generates follow-up explanations
- [ ] **Comparison View:**
  - Upload before/after images
  - Side-by-side display

**Deliverable:** Feature-complete MVP ready for testing

---

### **Sprint 6: DICOM Support (Week 8)** 
**Goal:** Support professional medical imaging format

- [ ] Integrate Cornerstone.js library
- [ ] Build DICOM viewer component
- [ ] Create Edge Function to:
  - Parse DICOM files
  - Strip patient metadata (name, DOB, etc.)
  - Convert to PNG for AI analysis
  - Return anonymized file
- [ ] Add DICOM upload option
- [ ] Display DICOM with proper windowing controls

**Deliverable:** Advanced users can upload DICOM files

---

### **Sprint 7: Polish & Launch Prep (Week 9-10)**  
**Goal:** Production-ready application

**UX Polish:**
- [ ] Onboarding flow (3-step tutorial)
- [ ] Empty states for new users
- [ ] Error handling & user-friendly messages
- [ ] Mobile responsive design
- [ ] Dark mode support

**Legal & Compliance:**
- [ ] Add Terms of Service page
- [ ] Add Privacy Policy (DPDP Act compliant)
- [ ] Implement cookie consent banner
- [ ] Persistent educational disclaimer on all pages
- [ ] "Report incorrect result" feedback form

**Analytics & Monitoring:**
- [ ] Set up Sentry for error tracking
- [ ] Implement Supabase Analytics
- [ ] Track key metrics:
  - Daily Active Users (DAU)
  - Images analyzed per user
  - Average session duration
  - User satisfaction (thumbs up/down)

**Performance:**
- [ ] Image optimization (Next.js Image component)
- [ ] Lazy loading for chat history
- [ ] Edge caching for static assets
- [ ] Database query optimization

**Deliverable:** Production deployment on Vercel + Supabase

---

## 8. AI Prompt Engineering Strategy

### 8.1 System Prompt for SnapDx

```typescript
const SNAPDX_SYSTEM_PROMPT = `You are SnapDx, an AI educational assistant for orthopedic learning. You help medical students and residents understand fractures, diseases, and management protocols.

## Core Rules:
1. **Educational Only**: Always remind users this is for learning, not clinical diagnosis
2. **Confidence Scores**: Provide confidence % for all diagnostic suggestions
3. **Cite Sources**: Reference medical literature when possible
4. **Admit Uncertainty**: Say "I don't have verified information" rather than guessing
5. **Safety First**: For emergencies (compartment syndrome, open fractures), always say "Seek immediate medical attention"

## Response Format:
When analyzing images:
- State what you see
- Provide classification (if applicable)
- Give confidence score
- Explain clinical significance
- Offer management overview
- List common complications

## Context:
${retrievedKnowledge} // Injected from RAG search

## Example Response:
"This appears to be a **Distal Radius Fracture** (Colles' type). Confidence: 92%

🔍 What I see:
- Fracture line at metaphyseal region
- Dorsal angulation present
- Intra-articular extension visible

📚 Classification: AO/OTA 23-A2

🏥 Typical Management:
- Closed reduction + splinting (most cases)
- ORIF if: >5mm radial shortening, >2mm articular step-off

Source: Campbell's Operative Orthopaedics, 14th Ed.

Would you like to know about complications or surgical techniques?"
`;
```

### 8.2 Image Analysis Flow

```typescript
async function analyzeImage(imageUrl: string, userQuestion: string) {
  // 1. Search knowledge base for relevant context
  const relevantDocs = await searchKnowledge(userQuestion);
  
  // 2. Build context from retrieved documents
  const context = relevantDocs
    .map(doc => `Source: ${doc.source}\n${doc.content}`)
    .join('\n\n---\n\n');
  
  // 3. Call Claude with image + context
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: SNAPDX_SYSTEM_PROMPT.replace('${retrievedKnowledge}', context),
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'url',
            url: imageUrl
          }
        },
        {
          type: 'text',
          text: userQuestion || 'What do you see in this image? Provide a detailed orthopedic analysis.'
        }
      ]
    }]
  });
  
  // 4. Parse response and extract metadata
  const aiMessage = response.content[0].text;
  const confidenceMatch = aiMessage.match(/Confidence:\s*(\d+)%/);
  const classificationMatch = aiMessage.match(/Classification:\s*([^\n]+)/);
  
  return {
    message: aiMessage,
    metadata: {
      confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : null,
      classification: classificationMatch ? classificationMatch[1].trim() : null,
      sources: relevantDocs.map(d => d.source)
    }
  };
}
```

---

## 9. Compliance & Safety (Phase 1 - Educational)

### 9.1 Legal Framework (India)

**Regulatory Position:**
- ✅ **NOT a Medical Device** (Phase 1) - strictly educational tool
- ✅ **DPDP Act 2023 Compliant** - explicit consent, data minimization
- ✅ **NMC Guidelines Compatible** - AI as assistant, not autonomous decider

**Required Legal Pages:**
1. **Terms of Service**
   - Educational use only
   - No warranty of accuracy
   - User responsibility for clinical decisions
   - Age restriction (18+)

2. **Privacy Policy**
   - What data we collect (email, images, chat history)
   - How we use it (service provision, improvement)
   - How long we keep it (retention policy)
   - User rights (access, delete, export)
   - India data residency

3. **Disclaimer** (Persistent on every page)

### 9.2 UI Implementation of Disclaimer

```typescript
// components/Disclaimer.tsx
export function Disclaimer() {
  return (
    <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-900">
            ⚠️ Educational Tool Only
          </h3>
          <p className="text-sm text-amber-800 mt-1">
            SnapDx is for learning purposes and is <strong>NOT a medical device</strong>. 
            Do not use for clinical diagnosis or treatment decisions. 
            Always consult a qualified healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}

// Show on every chat page
<ChatInterface>
  <Disclaimer />
  {messages.map(...)}
</ChatInterface>
```

### 9.3 Data Privacy Features

**User Control:**
- ✅ Download all data (GDPR-style export)
- ✅ Delete account (hard delete from database)
- ✅ Opt-out of analytics
- ✅ Session-only mode (no data saved)

**Security Measures:**
- ✅ All images stored in private Supabase buckets
- ✅ Row Level Security (RLS) enforced
- ✅ HTTPS only (forced redirect)
- ✅ No third-party analytics trackers
- ✅ Image metadata stripped automatically

### 9.4 Emergency Response Protocol

If AI detects critical conditions:

```typescript
const CRITICAL_CONDITIONS = [
  'open fracture',
  'compartment syndrome',
  'vascular injury',
  'spinal cord injury'
];

function checkForEmergency(aiResponse: string): boolean {
  return CRITICAL_CONDITIONS.some(condition => 
    aiResponse.toLowerCase().includes(condition)
  );
}

// In AI response handler
if (checkForEmergency(response)) {
  return {
    type: 'emergency',
    message: `⚠️ **MEDICAL EMERGENCY DETECTED**
    
    This condition requires immediate medical attention.
    
    **DO NOT DELAY:**
    • Call emergency services (108 in India)
    • Go to nearest Emergency Room
    • Time is critical for treatment
    
    SnapDx is an educational tool and cannot replace emergency care.`
  };
}
```

---

## 10. Monetization Strategy

### 10.1 Freemium Model

**Free Tier ("SnapDx Basic"):**
- 10 image analyses per month
- Unlimited text-only chat
- Basic fracture classification
- Mobile & web access
- **Price:** ₹0/month

**Pro Tier ("SnapDx Pro"):**
- Unlimited image analyses
- DICOM file support
- Advanced classifications (AO/OTA, Neer, Garden)
- Save up to 100 cases
- Priority support
- **Price:** ₹499/month (~$6 USD)

**Student Tier ("SnapDx Student"):**
- All Pro features
- 50% discount with student ID verification
- **Price:** ₹249/month (~$3 USD)

### 10.2 B2B/Institution Model

**Medical College Package:**
- Bulk licenses (50-500 students)
- Admin dashboard for tracking
- Custom branding option
- Dedicated training session
- **Price:** ₹99,000/year (~$1,200 USD) for 100 licenses

### 10.3 Revenue Projections (Year 1)

**Conservative Estimate:**
- 500 registered users in 3 months
- 10% conversion to paid (50 users)
- Average ₹350/month revenue per paid user
- **MRR:** ₹17,500 (~$210 USD)
- **Year 1 ARR:** ₹2,10,000 (~$2,500 USD)

**Optimistic Estimate:**
- 2,000 users in 6 months
- 15% conversion (300 paid users)
- 2 medical college partnerships
- **MRR:** ₹1,05,000 + ₹16,500 (institutions) = ₹1,21,500
- **Year 1 ARR:** ₹14,58,000 (~$17,500 USD)

---

## 11. Go-to-Market Strategy

### 11.1 Launch Plan

**Phase 1: Soft Launch (Week 1-4)**
- Private beta with 50 hand-picked medical students
- Gather feedback via in-app surveys
- Iterate on UX based on real usage
- Build case studies & testimonials

**Phase 2: Public Launch (Month 2)**
- **Product Hunt launch** (aim for #1 Product of the Day)
- **Reddit:** Post in r/medicalschool, r/Residency
- **WhatsApp groups:** Share in medical student groups
- **Instagram:** Create @snapdx.ai with educational content
- **LinkedIn:** Thought leadership posts about AI in medical education

**Phase 3: Growth (Month 3-6)**
- Content marketing: Weekly blog posts on fracture classifications
- YouTube: Short explainer videos (60-90 seconds)
- Medical college partnerships: Offer free trials to institutions
- Referral program: Give 1 month free Pro for each referral

### 11.2 Marketing Channels

**Primary:**
1. **Medical Student WhatsApp Groups** (Highest ROI)
   - Directly reach target audience
   - Viral sharing potential
   
2. **Instagram Medical Community** (#medstudent #medicalstudent)
   - Visual content performs well
   - Influencer partnerships (micro-influencers)

3. **Medical College Seminars**
   - Guest lectures on "AI in Orthopedics"
   - Live demos of SnapDx

**Secondary:**
1. SEO - Target keywords: "fracture classification", "AO OTA classification"
2. Google Ads - Target "orthopedic study app"
3. Medical forums (StudentDoctor, PagalGuy)

### 11.3 Content Strategy

**Weekly Content Calendar:**
- **Monday:** Instagram post - "Fracture of the Week"
- **Wednesday:** Blog post - Deep dive on a classification system
- **Friday:** YouTube Short - 60-second case study
- **Sunday:** Email newsletter - Tips & tricks for using SnapDx

**Example Content:**
- "5 Fractures Every Medical Student Must Know Before Ortho Rotation"
- "Colles vs Smith vs Barton: Never Confuse Them Again"
- "How to Ace Your Orthopedic OSCE Using SnapDx"

---

## 12. Success Metrics & KPIs

### 12.1 Product Metrics (First 3 Months)

**User Acquisition:**
- 500 total registered users
- 20% Week-1 retention
- 50 daily active users (DAU)

**Engagement:**
- Average 5 image analyses per user
- 15-minute average session duration
- 3+ chat sessions per active user

**Quality:**
- 85%+ positive feedback on AI accuracy
- <5% error reports
- 4.5+ star rating (if app store launch)

**Conversion:**
- 10% free-to-paid conversion rate
- ₹17,500 MRR by Month 3

### 12.2 Technical Metrics

**Performance:**
- <3 seconds image analysis response time
- 99.5% uptime
- <500ms database query response time

**AI Quality:**
- 90%+ accuracy on common fractures (validated against expert radiologists)
- <5% hallucination rate (responses without proper citations)

**Cost Management:**
- <₹50 per active user per month (AI API costs)
- <₹5,000/month total infrastructure (Supabase + Vercel + APIs)

---

## 13. Risks & Mitigation

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **AI Hallucination/Incorrect Diagnosis** | High (reputation damage, legal issues) | Medium | • Implement RAG with verified medical sources<br>• Show confidence scores prominently<br>• "Report incorrect result" feature<br>• Persistent disclaimers |
| **Regulatory Crackdown** | High (forced shutdown) | Low | • Clear educational positioning<br>• Strong disclaimers<br>• Avoid clinical language<br>• Monitor CDSCO updates |
| **Data Breach** | High (patient privacy violation) | Low | • Supabase RLS policies<br>• Automatic metadata stripping<br>• Regular security audits<br>• Penetration testing |
| **Low User Adoption** | Medium (slow growth) | Medium | • Early user feedback loops<br>• Strong GTM strategy<br>• Free tier with generous limits<br>• Influencer partnerships |
| **High AI API Costs** | Medium (unprofitable) | High | • Implement caching<br>• Rate limiting (10 images/month free)<br>• Batch processing<br>• Explore fine-tuned smaller models |
| **Competition** | Low (differentiator: education focus) | High | • First-mover advantage<br>• India-specific content<br>• Community building<br>• Superior UX |

---

## 14. Team Structure & Roles

### 14.1 For MVP Development (Can be 1-2 people initially)

**Required Skills:**
- **Full-Stack Development:** Next.js, TypeScript, Supabase
- **AI Integration:** Experience with LLM APIs (Claude/GPT-4)
- **Medical Domain Knowledge:** Nice-to-have (or advisor)

**Recommended Team (as you scale):**
1. **Technical Founder / Lead Developer** (You!)
   - Full-stack development
   - AI integration
   - DevOps & deployment

2. **Medical Advisor (Part-time consultant)**
   - Orthopedic resident or faculty
   - Validates AI outputs
   - Provides medical content
   - ₹15,000-25,000/month retainer

3. **UI/UX Designer (Contract initially)**
   - Design polish
   - User testing
   - ₹30,000-50,000 for full MVP design

**Future Hires (Post-PMF):**
- Medical Content Writer (for blog/marketing)
- Customer Success (for institution sales)
- Second Developer (mobile app)

---

## 15. Development Timeline Summary

```
Week 1-2:  Authentication & Chat UI ✅
Week 3:    Image Upload & Storage
Week 4:    AI Vision Integration
Week 5-6:  RAG Knowledge Base
Week 7:    Advanced Features
Week 8:    DICOM Support
Week 9-10: Polish & Launch Prep
─────────────────────────────────────
Total: 10 weeks to MVP launch
```

**Expected Launch Date:** Late March 2026

---

## 16. Next Steps - Action Items for You

### Immediate (This Week):
- [ ] **Set up Supabase account**
  - Choose Mumbai region
  - Create new project: "snapdx-prod"
  - Note down: Project URL, Anon Key, Service Key

- [ ] **Register domain**
  - Check availability: snapdx.com, snapdx.in, snapdx.app
  - Purchase + configure DNS

- [ ] **Create Anthropic account**
  - Sign up at console.anthropic.com
  - Get API key
  - Test Claude 3.5 Sonnet in playground

- [ ] **Set up Next.js project**
  - Initialize: `npx create-next-app@latest snapdx --typescript --tailwind --app`
  - Install dependencies: `npm install @supabase/supabase-js @supabase/auth-helpers-nextjs`

### Week 1 Goals:
- [ ] Basic auth working (email login)
- [ ] Landing page with SnapDx branding
- [ ] Database schema deployed
- [ ] First chat message sent & saved

---

## 17. Appendices

### A. Medical Datasets for Training/Testing

**Open-Source Datasets:**
1. **MURA (Stanford)** - 40,000+ musculoskeletal radiographs
2. **FracAtlas** - Fracture detection dataset
3. **CheXpert** - While chest X-rays, good for general radiology fine-tuning

**Guidelines to Index (for RAG):**
1. AO/OTA Fracture Classification Manual
2. AAOS Clinical Practice Guidelines (free sections)
3. Excerpts from Campbell's Operative Orthopaedics (fair use)
4. WHO Essential Surgical Care guidelines

### B. Similar Products (Competition Analysis)

| Product | Focus | Pricing | Strengths | Our Advantage |
|---------|-------|---------|-----------|---------------|
| **RadiologyAssistant** | General radiology education | Free | Comprehensive | SnapDx: Ortho-specific + AI chat |
| **Radiopaedia** | Medical imaging wiki | Free + Premium | Huge case library | SnapDx: Instant AI analysis |
| **Figure 1** | Medical case sharing | Free | Large doctor community | SnapDx: AI-powered insights |
| **Aidoc** | Clinical AI (B2B hospitals) | Enterprise | FDA-approved | SnapDx: Educational focus, India-centric |

**Key Differentiator:** We're the only AI chat assistant specifically for orthopedic education in the Indian market.

### C. Technology Trade-offs Explained

**Why Claude over GPT-4o?**
- Better reasoning for complex medical analysis
- Stronger adherence to safety guidelines
- Less prone to hallucination
- HIPAA-compliant infrastructure (AWS)

**Why Supabase over Firebase?**
- PostgreSQL (better for relational medical data)
- Built-in pgvector (no separate vector DB)
- Better pricing transparency
- Full SQL access for complex queries

**Why Next.js over React SPA?**
- Better SEO (important for content marketing)
- Server components (faster initial load)
- Easy API routes
- Vercel deployment

---

## 18. Final Checklist Before Launch

**Technical:**
- [ ] All Supabase RLS policies tested
- [ ] Image metadata stripping verified
- [ ] AI response time <5 seconds
- [ ] Mobile responsive on iOS/Android
- [ ] Error handling for all edge cases

**Legal:**
- [ ] Terms of Service drafted & reviewed
- [ ] Privacy Policy DPDP-compliant
- [ ] Disclaimer visible on every page
- [ ] Cookie consent implemented
- [ ] Age gate (18+ verification)

**Marketing:**
- [ ] Landing page with clear value prop
- [ ] 3 demo videos ready
- [ ] Product Hunt page created
- [ ] 50 beta users lined up
- [ ] Social media accounts created

**Business:**
- [ ] Stripe/Razorpay integration tested
- [ ] Pricing page finalized
- [ ] Customer support email set up
- [ ] Basic analytics dashboard
- [ ] Refund policy defined

---

## Conclusion

**SnapDx** positions itself uniquely at the intersection of AI, medical education, and the Indian healthcare system. By starting as an educational tool, we avoid the regulatory complexity of a Class C medical device while building a valuable product that students genuinely need.

**The Path Forward:**
1. **Weeks 1-10:** Build MVP with core features
2. **Month 3:** Soft launch with 50 beta users
3. **Month 4:** Public launch + Product Hunt
4. **Month 6:** First medical college partnership
5. **Year 2:** Pivot to clinical tool (if traction exists)

**Your Next Action:** 
Set up Supabase project and start coding the authentication flow. Once that's working, everything else will follow naturally.

---

**Questions? Adjustments needed?** Let me know if you want me to:
- Generate the actual Next.js code structure
- Write the Supabase database migration file
- Create the landing page copy
- Design the pitch deck for investors
- Anything else!

Ready to build this? 🚀