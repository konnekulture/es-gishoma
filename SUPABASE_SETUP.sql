
-- 1. DATABASE TABLES SETUP
-- Copy and run this in your Supabase SQL Editor

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin'
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  isFeatured BOOLEAN DEFAULT false,
  date TEXT NOT NULL,
  deletedAt TEXT
);

-- Staff Table
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image TEXT,
  department TEXT,
  email TEXT,
  deletedAt TEXT
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT NOT NULL,
  category TEXT NOT NULL,
  isFeatured BOOLEAN DEFAULT false,
  deletedAt TEXT
);

-- Curriculum Books Table
CREATE TABLE IF NOT EXISTS curriculum_books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  fileName TEXT,
  fileUrl TEXT,
  deletedAt TEXT
);

-- Past Papers Table
CREATE TABLE IF NOT EXISTS past_papers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  year INTEGER,
  division TEXT,
  section TEXT,
  fileName TEXT,
  fileUrl TEXT,
  deletedAt TEXT
);

-- A-Level Sections
CREATE TABLE IF NOT EXISTS alevel_sections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Alumni Stories Table (Public spotlights)
CREATE TABLE IF NOT EXISTS alumni_stories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  classYear TEXT NOT NULL,
  role TEXT,
  quote TEXT NOT NULL,
  image TEXT,
  deletedAt TEXT
);

-- Alumni Join Requests Table (Applications from alumni)
CREATE TABLE IF NOT EXISTS alumni_join_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  classYear TEXT NOT NULL,
  currentRole TEXT,
  instagram TEXT,
  status TEXT DEFAULT 'pending',
  submittedAt TEXT NOT NULL
);

-- Ensure correct columns exist in case table was created earlier without them
DO $$ 
BEGIN 
  -- alumni_stories fixes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alumni_stories' AND column_name='classYear') THEN
    ALTER TABLE alumni_stories ADD COLUMN classYear TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alumni_stories' AND column_name='quote') THEN
    ALTER TABLE alumni_stories ADD COLUMN quote TEXT;
  END IF;

  -- alumni_join_requests fixes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alumni_join_requests' AND column_name='classYear') THEN
    ALTER TABLE alumni_join_requests ADD COLUMN classYear TEXT;
  END IF;
  
  -- home_config fixes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='home_config' AND column_name='schoolBriefImage') THEN
    ALTER TABLE home_config ADD COLUMN schoolBriefImage TEXT;
  END IF;

  -- contact_messages fixes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contact_messages' AND column_name='status') THEN
    ALTER TABLE contact_messages ADD COLUMN status TEXT DEFAULT 'new';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contact_messages' AND column_name='replies') THEN
    ALTER TABLE contact_messages ADD COLUMN replies JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contact_messages' AND column_name='deletedAt') THEN
    ALTER TABLE contact_messages ADD COLUMN deletedAt TEXT;
  END IF;
END $$;

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  replies JSONB DEFAULT '[]'::jsonb,
  deletedAt TEXT
);

-- Home Config
CREATE TABLE IF NOT EXISTS home_config (
  id TEXT PRIMARY KEY CHECK (id = 'current'),
  heroTitle TEXT,
  heroSubtitle TEXT,
  heroImage TEXT,
  schoolBrief TEXT,
  schoolBriefImage TEXT,
  aboutHeroImage TEXT,
  aboutLegacyImage1 TEXT,
  aboutLegacyImage2 TEXT
);

-- NOTE: If you add columns and see "schema cache" errors, run the command below: 
-- NOTIFY pgrst, 'reload schema';

-- Traffic Stats
CREATE TABLE IF NOT EXISTS traffic_stats (
  id TEXT PRIMARY KEY CHECK (id = 'global'),
  totalVisitors INTEGER DEFAULT 0,
  pageViews JSONB DEFAULT '{}'::jsonb,
  dailyTrends JSONB DEFAULT '[]'::jsonb,
  activeVisitors INTEGER DEFAULT 0
);

-- 2. DISABLE RLS (Quick Start)
-- Copy and run these to ensure tables are accessible
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS curriculum_books DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS past_papers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS alevel_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS alumni_stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS alumni_join_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS home_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS traffic_stats DISABLE ROW LEVEL SECURITY;

-- IMPORTANT: RUN THIS FINALLY TO FIX SCHEMA CACHE ISSUES
NOTIFY pgrst, 'reload schema';

-- 3. STORAGE SETUP
-- Go to Supabase Dashboard -> Storage
-- 1. Create a NEW BUCKET named "uploads"
-- 2. Make it PUBLIC

-- 4. STORAGE POLICIES (Run this in SQL Editor)
-- This allows anyone to upload/download/delete files in the "uploads" bucket.
-- In a production app, you should restrict this to authenticated users.

-- Allow public access to read files
CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING ( bucket_id = 'uploads' );

-- Allow public access to upload files
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'uploads' );

-- Allow public access to update files
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'uploads' );

-- Allow public access to delete files
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'uploads' );
