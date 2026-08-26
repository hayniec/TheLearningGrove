-- =========================================================================
-- THE LEARNING GROVE - COMPLETE DATABASE SETUP & SEED SCRIPT
-- Copy and run this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/amillvpnviaymjbfunep/sql
-- =========================================================================

-- Step 1: Drop old table schemas to avoid missing column errors
DROP TABLE IF EXISTS curriculum_reviews CASCADE;
DROP TABLE IF EXISTS curricula CASCADE;
DROP TABLE IF EXISTS fieldtrips CASCADE;
DROP TABLE IF EXISTS businessads CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS communityposts CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Step 2: Create fresh, clean Tables with all columns
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'Parent',
  "assignedRoles" TEXT[] DEFAULT ARRAY['Parent'],
  "parentId" TEXT,
  parentid TEXT,
  "isSiteOwner" BOOLEAN DEFAULT false,
  "isAdmin" BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE curricula (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT,
  delivery TEXT,
  grouping TEXT,
  cost TEXT,
  rating NUMERIC DEFAULT 5,
  "favoritePart" TEXT,
  "answerKey" TEXT,
  methodology TEXT,
  "onlineResources" BOOLEAN DEFAULT false,
  "selfPaced" BOOLEAN DEFAULT false,
  "classParticipation" BOOLEAN DEFAULT false,
  worldview TEXT,
  videos BOOLEAN DEFAULT false,
  description TEXT,
  "gradeLevels" TEXT,
  "userId" TEXT
);

CREATE TABLE curriculum_reviews (
  id TEXT PRIMARY KEY,
  "curriculumId" TEXT,
  "userId" TEXT,
  "userName" TEXT,
  rating NUMERIC DEFAULT 5,
  "favoritePart" TEXT,
  description TEXT,
  "websiteUrl" TEXT,
  "createdAt" BIGINT
);

CREATE TABLE fieldtrips (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT,
  cost TEXT,
  rating NUMERIC DEFAULT 5,
  description TEXT,
  location TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  "websiteUrl" TEXT,
  "gradeRecommendation" TEXT,
  lat NUMERIC,
  lng NUMERIC,
  "userId" TEXT
);

CREATE TABLE businessads (
  id TEXT PRIMARY KEY,
  owner TEXT,
  "businessName" TEXT NOT NULL,
  description TEXT,
  category TEXT,
  "businessType" TEXT,
  contact TEXT,
  link TEXT,
  "userId" TEXT
);

CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  author TEXT,
  role TEXT,
  title TEXT NOT NULL,
  category TEXT,
  "categoryLabel" TEXT,
  content TEXT,
  tags TEXT[],
  likes INT DEFAULT 0,
  replies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  "userId" TEXT
);

CREATE TABLE communityposts (
  id TEXT PRIMARY KEY,
  author TEXT,
  role TEXT,
  title TEXT NOT NULL,
  category TEXT,
  "categoryLabel" TEXT,
  content TEXT,
  tags TEXT[],
  likes INT DEFAULT 0,
  replies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  "userId" TEXT
);

CREATE TABLE resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT,
  cost TEXT,
  link TEXT,
  description TEXT,
  type TEXT,
  approved BOOLEAN DEFAULT true,
  "submittedBy" TEXT,
  "submittedByEmail" TEXT,
  "createdAt" BIGINT
);

-- Step 3: Reseed USERS (ONLY Eric Haynie & Allison Haynie)
-- Password hash for 'rar0117' (SHA-256): 
-- b561d1660c5b9d5526050b73aab5e88c87299175f0b1e8144bbcdb7681cd11d3
INSERT INTO users (id, email, password, name, role, "assignedRoles", "parentId") VALUES
('admin-eric-haynie', 'eric.haynie@gmail.com', 'b561d1660c5b9d5526050b73aab5e88c87299175f0b1e8144bbcdb7681cd11d3', 'Eric Haynie', 'Admin', ARRAY['Admin', 'Moderator', 'Parent'], NULL),
('admin-erichaney', 'erichaney@gmail.com', 'b561d1660c5b9d5526050b73aab5e88c87299175f0b1e8144bbcdb7681cd11d3', 'Eric Haney', 'Admin', ARRAY['Admin', 'Moderator', 'Parent'], NULL),
('admin-alison-haney', 'alisonhaney35@gmail.com', 'b561d1660c5b9d5526050b73aab5e88c87299175f0b1e8144bbcdb7681cd11d3', 'Alison Haney', 'Admin', ARRAY['Admin', 'Moderator', 'Parent'], NULL),
('admin-allison-haynie', 'allison.haynie35@gmail.com', 'b561d1660c5b9d5526050b73aab5e88c87299175f0b1e8144bbcdb7681cd11d3', 'Allison Haynie', 'Admin', ARRAY['Admin', 'Moderator', 'Parent'], NULL);
