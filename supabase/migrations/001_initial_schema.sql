-- SnapDx Initial Database Schema
-- Run this in Supabase SQL Editor

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- ============================================
-- User Profiles Table
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  institution text,
  year_of_study int,
  specialization text check (specialization in ('ortho_resident', 'medical_student', 'gp', 'other')),
  avatar_url text,
  usage_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security for profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- ============================================
-- Chat Sessions Table
-- ============================================
create table public.chat_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text default 'Untitled Case' not null,
  case_tags text[] default array[]::text[],
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security for chat_sessions
alter table public.chat_sessions enable row level security;

create policy "Users can CRUD own sessions"
  on chat_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================
-- Messages Table
-- ============================================
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  image_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security for messages
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

create policy "Users can update messages in own sessions"
  on messages for update
  using (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

create policy "Users can delete messages in own sessions"
  on messages for delete
  using (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

-- ============================================
-- Knowledge Documents Table (for RAG)
-- ============================================
create table public.knowledge_documents (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  source text not null,
  category text,
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for fast vector similarity search
create index on knowledge_documents 
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Row Level Security for knowledge_documents
alter table public.knowledge_documents enable row level security;

create policy "Knowledge is publicly readable"
  on knowledge_documents for select
  to authenticated
  using (true);

-- Only admins can insert/update/delete knowledge (managed via service role)

-- ============================================
-- Usage Logs Table
-- ============================================
create table public.usage_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  action_type text not null check (action_type in ('image_analysis', 'chat_message', 'session_created')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security for usage_logs
alter table public.usage_logs enable row level security;

create policy "Users can view own usage"
  on usage_logs for select
  using (auth.uid() = user_id);

create policy "Service can insert usage logs"
  on usage_logs for insert
  with check (true);

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for auto-updating timestamps
create trigger update_profiles_updated_at 
  before update on profiles
  for each row 
  execute procedure update_updated_at_column();

create trigger update_chat_sessions_updated_at 
  before update on chat_sessions
  for each row 
  execute procedure update_updated_at_column();

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- Vector Similarity Search Function for RAG
-- ============================================
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id uuid,
  title text,
  content text,
  source text,
  category text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    knowledge_documents.id,
    knowledge_documents.title,
    knowledge_documents.content,
    knowledge_documents.source,
    knowledge_documents.category,
    1 - (knowledge_documents.embedding <=> query_embedding) as similarity
  from knowledge_documents
  where 1 - (knowledge_documents.embedding <=> query_embedding) > match_threshold
  order by knowledge_documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- ============================================
-- Storage Buckets (Create via Dashboard)
-- ============================================
-- Bucket name: medical-images
-- Public: false
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, application/dicom

-- Storage policies (apply after bucket creation)
-- These are examples - adjust the bucket_id if needed

-- Policy for users to upload own images
create policy "Users can upload own images"
  on storage.objects for insert
  with check (
    bucket_id = 'medical-images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy for users to view own images
create policy "Users can view own images"
  on storage.objects for select
  using (
    bucket_id = 'medical-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy for users to delete own images
create policy "Users can delete own images"
  on storage.objects for delete
  using (
    bucket_id = 'medical-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- Initial Data (Optional)
-- ============================================

-- Insert sample knowledge document (for testing)
-- In production, you'll bulk import medical literature

-- Example:
-- insert into knowledge_documents (title, content, source, category) 
-- values (
--   'Distal Radius Fractures - Overview',
--   'Distal radius fractures are among the most common fractures...',
--   'Campbell''s Operative Orthopaedics, 14th Edition, Chapter 54',
--   'fracture_classification'
-- );
