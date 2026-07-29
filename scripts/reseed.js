import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://amillvpnviaymjbfunep.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaWxsdnBudmlheW1qYmZ1bmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxOTIwNTgsImV4cCI6MjEwMDc2ODA1OH0.LVAlU8mlQLZ3nWfa-G3XcivMixdQbb0HvHhhJzZ1W4Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function reseed() {
  console.log("🌱 Starting automated database reset & reseed...");

  // 1. Clear records
  console.log("Clearing tables...");
  await supabase.from('curriculum_reviews').delete().neq('id', '0');
  await supabase.from('curricula').delete().neq('id', '0');
  await supabase.from('fieldtrips').delete().neq('id', '0');
  await supabase.from('businessads').delete().neq('id', '0');
  await supabase.from('communityposts').delete().neq('id', '0');
  await supabase.from('resources').delete().neq('id', '0');
  await supabase.from('users').delete().neq('id', '0');

  // 2. Insert Users
  console.log("Inserting default users...");
  const { error: userErr } = await supabase.from('users').upsert([
    { id: 'admin-1', email: 'hostingsite.wanting320@passmail.net', password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', name: 'Site Owner', role: 'Admin', assignedRoles: ['Admin', 'Moderator', 'Parent'] },
    { id: 'admin-2', email: 'allison.haynie35@gmail.com', password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', name: 'Allison Haynie', role: 'Admin', assignedRoles: ['Admin', 'Moderator', 'Parent'] },
    { id: 'admin-3', email: 'erick.haynie@gmail.com', password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', name: 'Eric Haynie', role: 'Admin', assignedRoles: ['Admin', 'Moderator', 'Parent'] },
    { id: 'parent-1', email: 'sarah.jenkins@example.com', password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', name: 'Sarah Jenkins', role: 'Parent', assignedRoles: ['Parent'] },
    { id: 'parent-2', email: 'david.miller@example.com', password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', name: 'David Miller', role: 'Parent', assignedRoles: ['Parent'] }
  ]);
  if (userErr) console.warn("User upsert note:", userErr.message);

  // 3. Insert Curricula
  console.log("Inserting curricula...");
  const { error: currErr } = await supabase.from('curricula').upsert([
    {
      id: 'beast-academy-math',
      name: 'Beast Academy Math',
      subject: 'Math',
      delivery: 'hybrid',
      grouping: 'grade',
      cost: '$$',
      rating: 5,
      favoritePart: 'Graphic novel comic books that make high-level problem solving feel like a fun puzzle!',
      answerKey: 'provided',
      methodology: 'mastery',
      onlineResources: true,
      selfPaced: true,
      classParticipation: false,
      worldview: 'secular',
      videos: true,
      description: 'A challenging, comic-book based math curriculum designed by Art of Problem Solving for grades 2 through 5.',
      gradeLevels: '2nd Grade,3rd Grade,4th Grade,5th Grade',
      userId: 'admin-1'
    },
    {
      id: 'math-u-see',
      name: 'Math-U-See (Steve Demme)',
      subject: 'Math',
      delivery: 'textbook',
      grouping: 'mastery',
      cost: '$$$',
      rating: 5,
      favoritePart: 'Tactile block manipulatives and video instruction for mastery learning.',
      answerKey: 'provided',
      methodology: 'mastery',
      onlineResources: true,
      selfPaced: true,
      classParticipation: false,
      worldview: 'faith-based',
      videos: true,
      description: 'A multi-sensory, mastery-based math program that uses color-coded integer blocks to make abstract concepts visual.',
      gradeLevels: 'Kindergarten,1st Grade,2nd Grade,3rd Grade,4th Grade,5th Grade,Middle School',
      userId: 'admin-1'
    },
    {
      id: 'mystery-science',
      name: 'Mystery Science',
      subject: 'Science',
      delivery: 'online',
      grouping: 'grade',
      cost: '$$',
      rating: 5,
      favoritePart: 'Hands-on experiments with everyday household materials and engaging video mysteries.',
      answerKey: 'provided',
      methodology: 'unit-study',
      onlineResources: true,
      selfPaced: true,
      classParticipation: true,
      worldview: 'secular',
      videos: true,
      description: 'Open-and-go science mystery lessons featuring short video clips and interactive experiments.',
      gradeLevels: 'Kindergarten,1st Grade,2nd Grade,3rd Grade,4th Grade,5th Grade',
      userId: 'admin-2'
    },
    {
      id: 'all-about-reading',
      name: 'All About Reading',
      subject: 'Language Arts',
      delivery: 'textbook',
      grouping: 'mastery',
      cost: '$$$',
      rating: 5,
      favoritePart: 'Magnetic letter tiles and step-by-step scripted lesson plans for explicit phonics instruction.',
      answerKey: 'provided',
      methodology: 'mastery',
      onlineResources: false,
      selfPaced: true,
      classParticipation: false,
      worldview: 'secular',
      videos: false,
      description: 'Orton-Gillingham based multi-sensory reading program that teaches phonics, decoding, fluency, and comprehension.',
      gradeLevels: 'Kindergarten,1st Grade,2nd Grade,3rd Grade,4th Grade',
      userId: 'admin-2'
    },
    {
      id: 'story-of-the-world',
      name: 'The Story of the World (Susan Wise Bauer)',
      subject: 'History',
      delivery: 'textbook',
      grouping: 'family-style',
      cost: '$',
      rating: 5,
      favoritePart: 'Captivating storytelling audiobooks and detailed activity guides with maps and crafts.',
      answerKey: 'provided',
      methodology: 'classical',
      onlineResources: false,
      selfPaced: true,
      classParticipation: false,
      worldview: 'neutral',
      videos: false,
      description: 'A four-volume narrative history series covering Ancient Times through the Modern Age in an engaging chronological story format.',
      gradeLevels: '1st Grade,2nd Grade,3rd Grade,4th Grade,5th Grade,Middle School',
      userId: 'admin-3'
    }
  ]);
  if (currErr) console.warn("Curricula upsert note:", currErr.message);

  // 4. Insert Field Trips
  console.log("Inserting field trips...");
  const { error: tripErr } = await supabase.from('fieldtrips').upsert([
    {
      id: 'trip-fernbank-museum',
      name: 'Fernbank Museum of Natural History & Giant Screen Theater',
      subject: 'Science',
      cost: 'Free (Donation Encouraged)',
      rating: 5,
      description: 'Explore prehistoric dinosaur halls, hands-on science discovery rooms, 3D giant screen theater, and 75 acres of outdoor nature trails.',
      location: '767 Clifton Rd, Atlanta, GA 30307',
      city: 'Atlanta',
      state: 'GA',
      zip: '30307',
      websiteUrl: 'https://www.fernbankmuseum.org',
      gradeRecommendation: 'All Ages / Family Outing',
      lat: 33.7744,
      lng: -84.3276,
      userId: 'admin-1'
    },
    {
      id: 'trip-tellus-science',
      name: 'Tellus Science Museum & Observatory',
      subject: 'Science',
      cost: 'Free Admission',
      rating: 5,
      description: 'A 120,000 sq ft museum featuring fossil galleries, minerals, solar telescope observatory, transportation museum, and planetarium shows.',
      location: '100 Tellus Dr, Cartersville, GA 30120',
      city: 'Cartersville',
      state: 'GA',
      zip: '30120',
      websiteUrl: 'https://tellusmuseum.org',
      gradeRecommendation: 'Elementary (Ages 5-10)',
      lat: 34.2052,
      lng: -84.7554,
      userId: 'admin-1'
    },
    {
      id: 'trip-georgia-capitol',
      name: 'Georgia State Capitol & Educational Museum',
      subject: 'History',
      cost: 'Free Admission',
      rating: 4,
      description: 'Guided educational tour of the Georgia legislative chambers, historic gold dome, civics galleries, and state history museum exhibits.',
      location: '206 Washington St SW, Atlanta, GA 30334',
      city: 'Atlanta',
      state: 'GA',
      zip: '30334',
      websiteUrl: 'https://georgiacapitolmuseum.org',
      gradeRecommendation: 'Middle (Ages 11-13)',
      lat: 33.7490,
      lng: -84.3880,
      userId: 'admin-2'
    }
  ]);
  if (tripErr) console.warn("Field trips upsert note:", tripErr.message);

  // 5. Insert Business Ads
  console.log("Inserting business directory ads...");
  const { error: adErr } = await supabase.from('businessads').upsert([
    {
      id: 'ad-grove-tutoring',
      owner: 'Allison Haynie',
      businessName: 'Grove Math & Orton-Gillingham Reading Specialists',
      description: '1-on-1 personalized tutoring for visual and neurodivergent learners. Specializing in Beast Academy math and All About Reading phonics.',
      category: 'Tutoring Services',
      businessType: 'Tutoring Service',
      contact: 'tutoring@thelearninggrove.org | (404) 555-0192',
      link: 'https://thelearninggrove.org',
      userId: 'admin-2'
    },
    {
      id: 'ad-harmony-piano',
      owner: 'Eric Haynie',
      businessName: 'Harmony Pines Homeschool Piano & String Studio',
      description: 'Flexible morning and afternoon private music lessons for homeschool students. Classical, jazz, and music theory curriculum.',
      category: 'Extracurricular Classes',
      businessType: 'Lessons / Extracurricular',
      contact: 'music@thelearninggrove.org | (404) 555-0188',
      link: 'https://thelearninggrove.org',
      userId: 'admin-3'
    }
  ]);
  if (adErr) console.warn("Business ads upsert note:", adErr.message);

  // 6. Insert Community Posts
  console.log("Inserting community discussion posts...");
  const { error: postErr } = await supabase.from('communityposts').upsert([
    {
      id: 'post-1',
      author: 'Sarah Jenkins',
      role: 'PARENT',
      title: 'What is your favorite 4th-grade math curriculum for visual learners?',
      category: 'curriculum-qa',
      categoryLabel: '📚 Curriculum Q&A',
      content: 'My son struggles with plain textbook worksheets and benefits from visual manipulatives and short video lessons. We have looked into Beast Academy and Math-U-See. What have you found works best for visual 4th graders?',
      tags: ['#Math', '#4thGrade', '#VisualLearners', '#BeastAcademy'],
      likes: 12,
      replies: [
        { id: 'rep-1', author: 'Eric Haynie', content: 'Beast Academy is fantastic for visual problem-solving! The comic guide books keep kids engaged, and the online practice provides instant feedback.', created_at: '2 hours ago' },
        { id: 'rep-2', author: 'Allison Haynie', content: 'Seconding Beast Academy! We also used Math-U-See blocks for tactile math concepts.', created_at: '1 hour ago' }
      ],
      created_at: '2026-07-28T14:00:00Z',
      userId: 'parent-1'
    },
    {
      id: 'post-2',
      author: 'David Miller',
      role: 'PARENT',
      title: 'North Atlanta Science Museum Group Field Trip — Discount Rates Available!',
      category: 'coops-trips',
      categoryLabel: '🌲 Co-ops & Field Trips',
      content: 'We are organizing a group visit to the Science Museum for 15+ homeschool families on June 15th. Group admission is $8/student (normally $18). Let us know if your family would like to join!',
      tags: ['#FieldTrips', '#Science', '#Atlanta', '#CoOp'],
      likes: 18,
      replies: [
        { id: 'rep-3', author: 'Sarah Jenkins', content: 'Count us in! I have two 4th graders.', created_at: '3 hours ago' }
      ],
      created_at: '2026-07-26T16:30:00Z',
      userId: 'parent-2'
    }
  ]);
  if (postErr) console.warn("Community posts upsert note:", postErr.message);

  console.log("✅ Database reset & reseed process completed!");
}

reseed();
