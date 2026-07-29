-- =========================================================================
-- THE LEARNING GROVE - COMPLETE DATABASE SETUP & SEED SCRIPT
-- Copy and run this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/amillvpnviaymjbfunep/sql
-- =========================================================================

-- Step 1: Create Tables if they don't exist yet
CREATE TABLE IF NOT EXISTS users (
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

CREATE TABLE IF NOT EXISTS curricula (
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

CREATE TABLE IF NOT EXISTS curriculum_reviews (
  id TEXT PRIMARY KEY,
  "curriculumId" TEXT,
  "userId" TEXT,
  "userName" TEXT,
  rating NUMERIC DEFAULT 5,
  "favoritePart" TEXT,
  description TEXT,
  "createdAt" BIGINT
);

CREATE TABLE IF NOT EXISTS fieldtrips (
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

CREATE TABLE IF NOT EXISTS businessads (
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

CREATE TABLE IF NOT EXISTS posts (
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

CREATE TABLE IF NOT EXISTS communityposts (
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

CREATE TABLE IF NOT EXISTS resources (
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

-- Step 2: Enable RLS with permissive public access policies
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE curricula DISABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE fieldtrips DISABLE ROW LEVEL SECURITY;
ALTER TABLE businessads DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE communityposts DISABLE ROW LEVEL SECURITY;
ALTER TABLE resources DISABLE ROW LEVEL SECURITY;

-- Step 3: Clear all records safely
DELETE FROM curriculum_reviews;
DELETE FROM curricula;
DELETE FROM fieldtrips;
DELETE FROM businessads;
DELETE FROM posts;
DELETE FROM communityposts;
DELETE FROM resources;
DELETE FROM users;

-- Step 4: Reseed USERS
INSERT INTO users (id, email, password, name, role, "assignedRoles", "parentId") VALUES
('admin-1', 'hostingsite.wanting320@passmail.net', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Site Owner', 'Admin', ARRAY['Admin', 'Moderator', 'Parent'], NULL),
('admin-2', 'allison.haynie35@gmail.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Allison Haynie', 'Admin', ARRAY['Admin', 'Moderator', 'Parent'], NULL),
('admin-3', 'erick.haynie@gmail.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Eric Haynie', 'Admin', ARRAY['Admin', 'Moderator', 'Parent'], NULL),
('parent-1', 'sarah.jenkins@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Sarah Jenkins', 'Parent', ARRAY['Parent'], NULL),
('parent-2', 'david.miller@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'David Miller', 'Parent', ARRAY['Parent'], NULL);

-- Step 5: Reseed CURRICULA
INSERT INTO curricula (
  id, name, subject, delivery, grouping, cost, rating, "favoritePart", "answerKey", 
  methodology, "onlineResources", "selfPaced", "classParticipation", worldview, 
  videos, description, "gradeLevels", "userId"
) VALUES
(
  'beast-academy-math',
  'Beast Academy Math',
  'Math',
  'hybrid',
  'grade',
  '$$',
  5,
  'Graphic novel comic books that make high-level problem solving feel like a fun puzzle!',
  'provided',
  'mastery',
  true,
  true,
  false,
  'secular',
  true,
  'A challenging, comic-book based math curriculum designed by Art of Problem Solving for grades 2 through 5.',
  '2nd Grade,3rd Grade,4th Grade,5th Grade',
  'admin-1'
),
(
  'math-u-see',
  'Math-U-See (Steve Demme)',
  'Math',
  'textbook',
  'mastery',
  '$$$',
  5,
  'Tactile block manipulatives and video instruction for mastery learning.',
  'provided',
  'mastery',
  true,
  true,
  false,
  'faith-based',
  true,
  'A multi-sensory, mastery-based math program that uses color-coded integer blocks to make abstract concepts visual.',
  'Kindergarten,1st Grade,2nd Grade,3rd Grade,4th Grade,5th Grade,Middle School',
  'admin-1'
),
(
  'mystery-science',
  'Mystery Science',
  'Science',
  'online',
  'grade',
  '$$',
  5,
  'Hands-on experiments with everyday household materials and engaging video mysteries.',
  'provided',
  'unit-study',
  true,
  true,
  true,
  'secular',
  true,
  'Open-and-go science mystery lessons featuring short video clips and interactive experiments.',
  'Kindergarten,1st Grade,2nd Grade,3rd Grade,4th Grade,5th Grade',
  'admin-2'
),
(
  'all-about-reading',
  'All About Reading',
  'Language Arts',
  'textbook',
  'mastery',
  '$$$',
  5,
  'Magnetic letter tiles and step-by-step scripted lesson plans for explicit phonics instruction.',
  'provided',
  'mastery',
  false,
  true,
  false,
  'secular',
  false,
  'Orton-Gillingham based multi-sensory reading program that teaches phonics, decoding, fluency, and comprehension.',
  'Kindergarten,1st Grade,2nd Grade,3rd Grade,4th Grade',
  'admin-2'
),
(
  'story-of-the-world',
  'The Story of the World (Susan Wise Bauer)',
  'History',
  'textbook',
  'family-style',
  '$',
  5,
  'Captivating storytelling audiobooks and detailed activity guides with maps and crafts.',
  'provided',
  'classical',
  false,
  true,
  false,
  'neutral',
  false,
  'A four-volume narrative history series covering Ancient Times through the Modern Age in an engaging chronological story format.',
  '1st Grade,2nd Grade,3rd Grade,4th Grade,5th Grade,Middle School',
  'admin-3'
);

-- Step 6: Reseed CURRICULUM REVIEWS
INSERT INTO curriculum_reviews (id, "curriculumId", "userId", "userName", rating, "favoritePart", description, "createdAt") VALUES
(
  'review-beast-1',
  'beast-academy-math',
  'parent-1',
  'Sarah Jenkins',
  5,
  'Graphic novel comic books that make math feel like a puzzle!',
  'My 4th grader used to dread math worksheets. Beast Academy completely turned things around! The comic guide books are engaging and the online practice builds deep critical thinking skills.',
  1785280000000
),
(
  'review-mathusee-1',
  'math-u-see',
  'parent-2',
  'David Miller',
  5,
  'Tactile block manipulatives',
  'The color-coded blocks helped my kinesthetic learner grasp multi-digit multiplication and fractions effortlessly.',
  1785285000000
);

-- Step 7: Reseed FIELD TRIPS
INSERT INTO fieldtrips (
  id, name, subject, cost, rating, description, location, city, state, zip, "websiteUrl", "gradeRecommendation", lat, lng, "userId"
) VALUES
(
  'trip-fernbank-museum',
  'Fernbank Museum of Natural History & Giant Screen Theater',
  'Science',
  'Free (Donation Encouraged)',
  5,
  'Explore prehistoric dinosaur halls, hands-on science discovery rooms, 3D giant screen theater, and 75 acres of outdoor nature trails.',
  '767 Clifton Rd, Atlanta, GA 30307',
  'Atlanta',
  'GA',
  '30307',
  'https://www.fernbankmuseum.org',
  'All Ages / Family Outing',
  33.7744,
  -84.3276,
  'admin-1'
),
(
  'trip-tellus-science',
  'Tellus Science Museum & Observatory',
  'Science',
  'Free Admission',
  5,
  'A 120,000 sq ft museum featuring fossil galleries, minerals, solar telescope observatory, transportation museum, and planetarium shows.',
  '100 Tellus Dr, Cartersville, GA 30120',
  'Cartersville',
  'GA',
  '30120',
  'https://tellusmuseum.org',
  'Elementary (Ages 5-10)',
  34.2052,
  -84.7554,
  'admin-1'
),
(
  'trip-georgia-capitol',
  'Georgia State Capitol & Educational Museum',
  'History',
  'Free Admission',
  4,
  'Guided educational tour of the Georgia legislative chambers, historic gold dome, civics galleries, and state history museum exhibits.',
  '206 Washington St SW, Atlanta, GA 30334',
  'Atlanta',
  'GA',
  '30334',
  'https://georgiacapitolmuseum.org',
  'Middle (Ages 11-13)',
  33.7490,
  -84.3880,
  'admin-2'
);

-- Step 8: Reseed BUSINESS ADS
INSERT INTO businessads (
  id, owner, "businessName", description, category, "businessType", contact, link, "userId"
) VALUES
(
  'ad-grove-tutoring',
  'Allison Haynie',
  'Grove Math & Orton-Gillingham Reading Specialists',
  '1-on-1 personalized tutoring for visual and neurodivergent learners. Specializing in Beast Academy math and All About Reading phonics.',
  'Tutoring Services',
  'Tutoring Service',
  'tutoring@thelearninggrove.org | (404) 555-0192',
  'https://thelearninggrove.org',
  'admin-2'
),
(
  'ad-harmony-piano',
  'Eric Haynie',
  'Harmony Pines Homeschool Piano & String Studio',
  'Flexible morning and afternoon private music lessons for homeschool students. Classical, jazz, and music theory curriculum.',
  'Extracurricular Classes',
  'Lessons / Extracurricular',
  'music@thelearninggrove.org | (404) 555-0188',
  'https://thelearninggrove.org',
  'admin-3'
);

-- Step 9: Reseed POSTS & COMMUNITYPOSTS
INSERT INTO posts (
  id, author, role, title, category, "categoryLabel", content, tags, likes, replies, created_at, "userId"
) VALUES
(
  'post-1',
  'Sarah Jenkins',
  'PARENT',
  'What is your favorite 4th-grade math curriculum for visual learners?',
  'curriculum-qa',
  '📚 Curriculum Q&A',
  'My son struggles with plain textbook worksheets and benefits from visual manipulatives and short video lessons. We have looked into Beast Academy and Math-U-See. What have you found works best for visual 4th graders?',
  ARRAY['#Math', '#4thGrade', '#VisualLearners', '#BeastAcademy'],
  12,
  '[{"id":"rep-1","author":"Eric Haynie","content":"Beast Academy is fantastic for visual problem-solving! The comic guide books keep kids engaged, and the online practice provides instant feedback.","created_at":"2 hours ago"},{"id":"rep-2","author":"Allison Haynie","content":"Seconding Beast Academy! We also used Math-U-See blocks for tactile math concepts.","created_at":"1 hour ago"}]'::jsonb,
  '2026-07-28T14:00:00Z',
  'parent-1'
),
(
  'post-2',
  'David Miller',
  'PARENT',
  'North Atlanta Science Museum Group Field Trip — Discount Rates Available!',
  'coops-trips',
  '🌲 Co-ops & Field Trips',
  'We are organizing a group visit to the Science Museum for 15+ homeschool families on June 15th. Group admission is $8/student (normally $18). Let us know if your family would like to join!',
  ARRAY['#FieldTrips', '#Science', '#Atlanta', '#CoOp'],
  18,
  '[{"id":"rep-3","author":"Sarah Jenkins","content":"Count us in! I have two 4th graders.","created_at":"3 hours ago"}]'::jsonb,
  '2026-07-26T16:30:00Z',
  'parent-2'
);

INSERT INTO communityposts (
  id, author, role, title, category, "categoryLabel", content, tags, likes, replies, created_at, "userId"
) VALUES
(
  'post-1',
  'Sarah Jenkins',
  'PARENT',
  'What is your favorite 4th-grade math curriculum for visual learners?',
  'curriculum-qa',
  '📚 Curriculum Q&A',
  'My son struggles with plain textbook worksheets and benefits from visual manipulatives and short video lessons. We have looked into Beast Academy and Math-U-See. What have you found works best for visual 4th graders?',
  ARRAY['#Math', '#4thGrade', '#VisualLearners', '#BeastAcademy'],
  12,
  '[{"id":"rep-1","author":"Eric Haynie","content":"Beast Academy is fantastic for visual problem-solving! The comic guide books keep kids engaged, and the online practice provides instant feedback.","created_at":"2 hours ago"},{"id":"rep-2","author":"Allison Haynie","content":"Seconding Beast Academy! We also used Math-U-See blocks for tactile math concepts.","created_at":"1 hour ago"}]'::jsonb,
  '2026-07-28T14:00:00Z',
  'parent-1'
),
(
  'post-2',
  'David Miller',
  'PARENT',
  'North Atlanta Science Museum Group Field Trip — Discount Rates Available!',
  'coops-trips',
  '🌲 Co-ops & Field Trips',
  'We are organizing a group visit to the Science Museum for 15+ homeschool families on June 15th. Group admission is $8/student (normally $18). Let us know if your family would like to join!',
  ARRAY['#FieldTrips', '#Science', '#Atlanta', '#CoOp'],
  18,
  '[{"id":"rep-3","author":"Sarah Jenkins","content":"Count us in! I have two 4th graders.","created_at":"3 hours ago"}]'::jsonb,
  '2026-07-26T16:30:00Z',
  'parent-2'
);

-- Step 10: Reseed RESOURCES
INSERT INTO resources (
  id, name, subject, cost, link, description, type, approved, "submittedBy", "submittedByEmail", "createdAt"
) VALUES
(
  'res-khan-academy',
  'Khan Academy Homeschool Math & Science',
  'Math',
  'free',
  'https://www.khanacademy.org',
  'Comprehensive 100% free video courses, practice exercises, and mastery tracking across Pre-K through AP calculus and physics.',
  'website',
  true,
  'Sarah Jenkins',
  'sarah.jenkins@example.com',
  1785200000000
),
(
  'res-librivox-audio',
  'LibriVox Public Domain Audiobooks',
  'Language Arts',
  'free',
  'https://librivox.org',
  'Free public domain audiobooks of classic literature read by volunteers, ideal for family read-alouds and car trips.',
  'website',
  true,
  'David Miller',
  'david.miller@example.com',
  1785210000000
);

-- ALL TABLES CREATED & RESEEDED SUCCESSFULLY!
