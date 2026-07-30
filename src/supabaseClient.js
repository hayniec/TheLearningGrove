import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://amillvpnviaymjbfunep.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaWxsdnBudmlheW1qYmZ1bmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxOTIwNTgsImV4cCI6MjEwMDc2ODA1OH0.LVAlU8mlQLZ3nWfa-G3XcivMixdQbb0HvHhhJzZ1W4Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Browser-safe SHA-256 password hashing using Web Crypto API
export async function hashPassword(password) {
  const utf8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// --- CURRICULA ---
export async function getCurricula() {
  const defaultSampleCurricula = [
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
      gradeLevels: ['2nd Grade', '3rd Grade', '4th Grade', '5th Grade'],
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
      gradeLevels: ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', 'Middle School'],
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
      gradeLevels: ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade'],
      userId: 'admin-2'
    }
  ];

  try {
    const { data, error } = await supabase.from('curricula').select('*');
    if (!error && data && data.length > 0) {
      return data.map(r => ({
        ...r,
        onlineResources: !!r.onlineResources,
        selfPaced: !!r.selfPaced,
        classParticipation: !!r.classParticipation,
        videos: !!r.videos,
        gradeLevels: typeof r.gradeLevels === 'string' ? r.gradeLevels.split(',') : (r.gradeLevels || [])
      }));
    }
  } catch (err) {
    console.warn("getCurricula exception:", err);
  }
  return defaultSampleCurricula;
}

export async function getCurriculumReviews(curriculumId) {
  const { data, error } = await supabase
    .from('curriculum_reviews')
    .select('*')
    .eq('curriculumId', curriculumId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addCurriculum(item) {
  const id = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  const rating = Number(item.rating) || 5;
  
  const newCurriculumItem = {
    id,
    name: item.name,
    subject: item.subject,
    delivery: item.delivery,
    grouping: item.grouping,
    cost: item.cost,
    rating,
    favoritePart: item.favoritePart || '',
    answerKey: item.answerKey,
    methodology: item.methodology,
    onlineResources: !!item.onlineResources,
    selfPaced: !!item.selfPaced,
    classParticipation: !!item.classParticipation,
    worldview: item.worldview,
    videos: !!item.videos,
    description: item.description,
    gradeLevels: item.gradeLevels ? item.gradeLevels.join(',') : '',
    userId: item.userId || 'parent-1'
  };

  const newReviewItem = {
    id: `review-${id}-${Date.now().toString().slice(-4)}`,
    curriculumId: id,
    userId: item.userId || 'parent-1',
    userName: item.userName || 'Sarah Jenkins',
    rating,
    favoritePart: item.favoritePart || '',
    description: item.description || '',
    createdAt: Date.now()
  };

  const { error: currErr } = await supabase
    .from('curricula')
    .insert([newCurriculumItem]);
  if (currErr) throw currErr;

  const { error: revErr } = await supabase
    .from('curriculum_reviews')
    .insert([newReviewItem]);
  if (revErr) throw revErr;

  return {
    ...newCurriculumItem,
    gradeLevels: item.gradeLevels || []
  };
}

export async function addCurriculumReview(curriculumId, reviewItem) {
  const id = `review-${curriculumId}-${Date.now().toString().slice(-4)}`;
  const newReview = {
    id,
    curriculumId,
    userId: reviewItem.userId || 'parent-1',
    userName: reviewItem.userName || 'Sarah Jenkins',
    rating: Number(reviewItem.rating) || 5,
    favoritePart: reviewItem.favoritePart || '',
    description: reviewItem.description || '',
    createdAt: Date.now()
  };

  const { error: insErr } = await supabase
    .from('curriculum_reviews')
    .insert([newReview]);
  if (insErr) throw insErr;

  const { data: reviews, error: revErr } = await supabase
    .from('curriculum_reviews')
    .select('rating')
    .eq('curriculumId', curriculumId);
  if (revErr) throw revErr;

  const avgRating = reviews.length > 0
    ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
    : 5.0;

  const onlineVal = reviewItem.onlineResources ? true : false;
  const selfVal = reviewItem.selfPaced ? true : false;
  const classVal = reviewItem.classParticipation ? true : false;
  const videosVal = reviewItem.videos ? true : false;
  const gradesStr = reviewItem.gradeLevels ? reviewItem.gradeLevels.join(',') : '';

  const { error: updErr } = await supabase
    .from('curricula')
    .update({
      rating: avgRating,
      subject: reviewItem.subject,
      delivery: reviewItem.delivery,
      grouping: reviewItem.grouping,
      cost: reviewItem.cost,
      answerKey: reviewItem.answerKey,
      methodology: reviewItem.methodology,
      onlineResources: onlineVal,
      selfPaced: selfVal,
      classParticipation: classVal,
      worldview: reviewItem.worldview,
      videos: videosVal,
      gradeLevels: gradesStr
    })
    .eq('id', curriculumId);
  if (updErr) throw updErr;

  return newReview;
}

// --- SITE OWNER IDENTIFICATION ---
export const SITE_OWNER_EMAILS = [
  'owner@thelearninggrove.org',
  'admin@thelearninggrove.org',
  'hostingsite.wanting320@passmail.net',
  'allison.haynie35@gmail.com',
  'allison.haynie35@gmail',
  'eric.haynie@gmail.com',
  'eric.haynie@gmail',
  'erick.haynie@gmail.com',
  'erick.haynie@gmail'
];

export function isSiteOwner(user) {
  if (!user) return false;
  const role = (user.role || '').toLowerCase();
  if (role === 'admin' || role === 'siteowner' || role === 'owner') return true;
  if (user.isSiteOwner || user.isAdmin) return true;
  if (user.assignedRoles && user.assignedRoles.some(r => ['admin', 'siteowner', 'owner'].includes((r || '').toLowerCase()))) return true;
  if (user.email && SITE_OWNER_EMAILS.includes(user.email.toLowerCase())) return true;
  return false;
}

export function isModeratorOrOwner(user, resourceUserId = null) {
  if (!user) return false;
  if (isSiteOwner(user)) return true;

  const role = (user.role || '').toLowerCase();
  if (role === 'moderator' || role === 'admin' || role === 'owner') return true;

  if (user.assignedRoles && user.assignedRoles.some(r => ['moderator', 'admin', 'siteowner', 'owner'].includes((r || '').toLowerCase()))) {
    return true;
  }

  if (resourceUserId && (user.id === resourceUserId || user.email === resourceUserId)) {
    return true;
  }

  return false;
}

// --- FIELD TRIPS ---
export async function getFieldTrips() {
  const localTrips = JSON.parse(localStorage.getItem('grove_custom_fieldtrips') || '[]');
  let dbTrips = [];
  try {
    const { data, error } = await supabase.from('fieldtrips').select('*');
    if (!error && data && data.length > 0) {
      dbTrips = data;
    }
  } catch (err) {
    console.warn("getFieldTrips exception:", err);
  }

  const defaultSampleFieldTrips = [
    {
      id: 'trip-1',
      name: 'Fernbank Museum of Natural History & Giant Screen Theater',
      subject: 'Science',
      cost: 'Free (Donation Encouraged)',
      rating: 5,
      description: 'Explore prehistoric dinosaur halls, hands-on science discovery rooms, and outdoor forest trails.',
      location: '767 Clifton Rd, Atlanta, GA 30307',
      city: 'Atlanta',
      state: 'GA',
      zip: '30307',
      gradeRecommendation: 'All Ages / Family Outing'
    },
    {
      id: 'trip-2',
      name: 'Tellus Science Museum & Observatory',
      subject: 'Science',
      cost: 'Free Admission',
      rating: 5,
      description: '120,000 sq ft museum featuring fossil galleries, minerals, solar telescope observatory, and planetarium shows.',
      location: '100 Tellus Dr, Cartersville, GA 30120',
      city: 'Cartersville',
      state: 'GA',
      zip: '30120',
      gradeRecommendation: 'Elementary (Ages 5-10)'
    },
    {
      id: 'trip-3',
      name: 'Georgia State Capitol & Educational Museum',
      subject: 'History',
      cost: 'Free Admission',
      rating: 4,
      description: 'Guided tour of the legislative chambers, historic dome, and Georgia history museum.',
      location: '206 Washington St SW, Atlanta, GA 30334',
      city: 'Atlanta',
      state: 'GA',
      zip: '30334',
      gradeRecommendation: 'Middle (Ages 11-13)'
    }
  ];

  const merged = [...localTrips, ...dbTrips];
  if (merged.length === 0) return defaultSampleFieldTrips;

  const map = new Map();
  defaultSampleFieldTrips.forEach(t => map.set(t.id, t));
  merged.forEach(t => map.set(t.id, t));
  return Array.from(map.values());
}

export async function addFieldTrip(item) {
  const id = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  const dbUserId = (item.userId && !item.userId.startsWith('parent-') && !item.userId.startsWith('student-') && !item.userId.startsWith('sub-'))
    ? item.userId
    : null;

  const newItem = { 
    ...item, 
    id, 
    cost: item.cost ? item.cost.slice(0, 30) : 'Free',
    userId: dbUserId 
  };

  const existingLocal = JSON.parse(localStorage.getItem('grove_custom_fieldtrips') || '[]');
  localStorage.setItem('grove_custom_fieldtrips', JSON.stringify([newItem, ...existingLocal]));

  try {
    const { error } = await supabase.from('fieldtrips').insert([newItem]);
    if (error) {
      console.warn("addFieldTrip insert warning, attempting short cost fallback:", error);
      const fallbackItem = { ...newItem, cost: (item.cost || 'Free').slice(0, 10) };
      await supabase.from('fieldtrips').insert([fallbackItem]);
    }
  } catch (err) {
    console.warn("Supabase network exception, saved locally:", err);
  }
  return newItem;
}

// --- BUSINESS ADS ---
export async function getBusinessAds() {
  const localAds = JSON.parse(localStorage.getItem('grove_custom_ads') || '[]');
  const defaultSampleAds = [
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
  ];

  let dbAds = [];
  try {
    const { data, error } = await supabase.from('businessads').select('*');
    if (!error && data && data.length > 0) {
      dbAds = data;
    }
  } catch (err) {
    console.warn("getBusinessAds exception:", err);
  }

  const merged = [...localAds, ...dbAds];
  if (merged.length === 0) return defaultSampleAds;

  const map = new Map();
  defaultSampleAds.forEach(a => map.set(a.id, a));
  merged.forEach(a => map.set(a.id, a));
  return Array.from(map.values());
}

export async function addBusinessAd(item) {
  const id = item.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  const newItem = { ...item, id, userId: item.userId || 'parent-1' };
  try {
    const { error } = await supabase.from('businessads').insert([newItem]);
    if (error) console.warn("addBusinessAd insert warning:", error);
  } catch (e) {
    console.warn("addBusinessAd exception:", e);
  }
  const existingLocal = JSON.parse(localStorage.getItem('grove_custom_ads') || '[]');
  localStorage.setItem('grove_custom_ads', JSON.stringify([newItem, ...existingLocal]));
  return newItem;
}

// --- RESOURCES ---
export async function getResources() {
  const defaultSampleResources = [
    {
      id: 'res-khan-academy',
      name: 'Khan Academy Homeschool Math & Science',
      subject: 'Math',
      cost: 'free',
      link: 'https://www.khanacademy.org',
      description: 'Comprehensive 100% free video courses, practice exercises, and mastery tracking across Pre-K through AP calculus and physics.',
      type: 'website',
      approved: true,
      submittedBy: 'Sarah Jenkins',
      submittedByEmail: 'sarah.jenkins@example.com',
      createdAt: 1785200000000
    }
  ];

  try {
    const { data, error } = await supabase.from('resources').select('*');
    if (!error && data && data.length > 0) return data;
  } catch (err) {
    console.warn("getResources exception:", err);
  }
  return defaultSampleResources;
}



export async function addResource(item) {
  const id = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  const newItem = { 
    ...item, 
    id, 
    userId: item.userId || 'parent-1', 
    approved: item.approved !== undefined ? !!item.approved : false
  };
  const { error } = await supabase.from('resources').insert([newItem]);
  if (error) throw error;
  return newItem;
}

// --- COMMUNITY POSTS ---
export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('timestamp', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addPost(item) {
  const id = 'post-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000).toString();
  const newItem = { 
    ...item, 
    id, 
    timestamp: new Date().toISOString(),
    userId: item.userId || 'parent-1'
  };
  const { error } = await supabase.from('posts').insert([newItem]);
  if (error) throw error;
  return newItem;
}

// --- USER AUTHENTICATION ---
export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('email', email)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createUser(user) {
  const id = 'user-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000).toString();
  const hashedPassword = await hashPassword(user.password);
  const newUser = {
    id,
    email: user.email,
    password: hashedPassword,
    name: user.name,
    role: user.role || 'Parent'
  };
  if (user.parentId) {
    newUser.parentId = user.parentId;
  }
  const { error } = await supabase.from('users').insert([newUser]);
  if (error) {
    console.error("Supabase createUser error:", error);
    throw error;
  }
  return newUser;
}

export function getFamilyHeadId(user) {
  if (!user) return null;
  return user.parentId || user.parentid || user.id;
}

export async function getSubUsers(parentUserOrId) {
  let targetId = typeof parentUserOrId === 'object' ? getFamilyHeadId(parentUserOrId) : parentUserOrId;
  let { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('parentId', targetId)
    .eq('role', 'Student');

  if (error) {
    const res2 = await supabase
      .from('users')
      .select('*')
      .eq('parentid', targetId)
      .eq('role', 'Student');
    data = res2.data;
  }
  return data || [];
}

export async function getCoParents(parentUser) {
  const familyHeadId = getFamilyHeadId(parentUser);
  let { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`id.eq.${familyHeadId},parentId.eq.${familyHeadId}`)
    .eq('role', 'Parent');

  if (error) {
    const res2 = await supabase
      .from('users')
      .select('*')
      .or(`id.eq.${familyHeadId},parentid.eq.${familyHeadId}`)
      .eq('role', 'Parent');
    data = res2.data;
  }
  return data || [];
}

export async function linkCoParent(currentParentUser, coParentEmail) {
  const familyHeadId = getFamilyHeadId(currentParentUser);
  const coParent = await getUserByEmail(coParentEmail);
  if (!coParent) {
    throw new Error(`No account found for "${coParentEmail}". Ask your co-parent to register first, then link them here!`);
  }
  if (coParent.role !== 'Parent') {
    throw new Error(`Account "${coParentEmail}" is not registered as a Parent account.`);
  }
  if (coParent.id === currentParentUser.id) {
    throw new Error("You are already the active parent of this household.");
  }

  // Update co-parent record trying parentId first, falling back to parentid
  let res = await supabase
    .from('users')
    .update({ parentId: familyHeadId })
    .eq('id', coParent.id)
    .select()
    .maybeSingle();

  if (res.error) {
    console.warn("linkCoParent parentId update fallback to parentid:", res.error);
    res = await supabase
      .from('users')
      .update({ parentid: familyHeadId })
      .eq('id', coParent.id)
      .select()
      .maybeSingle();
  }

  if (res.error) throw res.error;
  return res.data || { ...coParent, parentId: familyHeadId, parentid: familyHeadId };
}

export async function createSubUser(parentUserOrId, subUser) {
  const parentId = typeof parentUserOrId === 'object' ? getFamilyHeadId(parentUserOrId) : parentUserOrId;
  const id = 'user-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000).toString();
  const hashedPassword = await hashPassword(subUser.password);
  
  const newUser = {
    id,
    email: subUser.email,
    password: hashedPassword,
    name: subUser.name,
    role: subUser.role || 'Student',
    parentId: parentId
  };
  
  let { error } = await supabase.from('users').insert([newUser]);
  if (error) {
    console.warn("createSubUser parentId insert fallback to parentid:", error);
    const fallbackUser = {
      id,
      email: subUser.email,
      password: hashedPassword,
      name: subUser.name,
      role: subUser.role || 'Student',
      parentid: parentId
    };
    const res2 = await supabase.from('users').insert([fallbackUser]);
    if (res2.error) throw res2.error;
  }
  return newUser;
}

// --- PENDING RESOURCES MODERATION ---
export async function getPendingResources() {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('approved', false);
  if (error) throw error;
  return data;
}

export async function approveResource(resourceId) {
  const { data, error } = await supabase
    .from('resources')
    .update({ approved: true })
    .eq('id', resourceId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function rejectResource(resourceId) {
  const { data: existing, error: getErr } = await supabase
    .from('resources')
    .select('*')
    .eq('id', resourceId)
    .maybeSingle();
  if (getErr) throw getErr;

  const { error: delErr } = await supabase
    .from('resources')
    .delete()
    .eq('id', resourceId);
  if (delErr) throw delErr;

  return existing;
}

// --- COMMUNITY DISCUSSION BOARD ---
export async function getCommunityPosts() {
  const localPosts = JSON.parse(localStorage.getItem('grove_custom_posts') || '[]');
  let dbPosts = [];
  try {
    const { data, error } = await supabase
      .from('communityposts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      dbPosts = data;
    }
  } catch (err) {
    console.warn("getCommunityPosts exception:", err);
  }

  const defaultSamplePosts = [
    {
      id: 'post-1',
      author: 'Sarah Jenkins',
      role: 'PARENT',
      title: "What is your favorite 4th-grade math curriculum for visual learners?",
      category: 'curriculum-qa',
      categoryLabel: '📚 Curriculum Q&A',
      content: "My son struggles with plain textbook worksheets and benefits from visual manipulatives and short video lessons. We've looked into Beast Academy and Math-U-See. What have you found works best for visual 4th graders?",
      tags: ['#Math', '#4thGrade', '#VisualLearners', '#BeastAcademy'],
      likes: 12,
      replies: [
        { id: 'rep-1', author: 'Eric H', content: "Beast Academy is fantastic for visual problem-solving! The comic guide books keep kids engaged, and the online practice provides instant feedback.", created_at: '2 hours ago' },
        { id: 'rep-2', author: 'Allison H', content: "Seconding Beast Academy! We also used Math-U-See blocks for tactile math concepts.", created_at: '1 hour ago' }
      ],
      created_at: '2026-07-28T14:00:00Z'
    },
    {
      id: 'post-2',
      author: 'David Miller',
      role: 'PARENT',
      title: "North Atlanta Science Museum Group Field Trip — Discount Rates Available!",
      category: 'coops-trips',
      categoryLabel: '🌲 Co-ops & Field Trips',
      content: "We are organizing a group visit to the Science Museum for 15+ homeschool families on June 15th. Group admission is $8/student (normally $18). Let us know if your family would like to join!",
      tags: ['#FieldTrips', '#Science', '#Atlanta', '#CoOp'],
      likes: 18,
      replies: [
        { id: 'rep-3', author: 'Sarah Jenkins', content: "Count us in! I have two 4th graders.", created_at: '3 hours ago' }
      ],
      created_at: '2026-07-26T16:30:00Z'
    }
  ];

  const merged = [...localPosts, ...dbPosts];
  if (merged.length === 0) return defaultSamplePosts;

  const map = new Map();
  defaultSamplePosts.forEach(p => map.set(p.id, p));
  merged.forEach(p => map.set(p.id, p));
  return Array.from(map.values());
}

export async function createCommunityPost(post) {
  const newPost = {
    id: 'post-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000).toString(),
    ...post,
    likes: 0,
    replies: [],
    created_at: new Date().toISOString()
  };

  const existingLocal = JSON.parse(localStorage.getItem('grove_custom_posts') || '[]');
  localStorage.setItem('grove_custom_posts', JSON.stringify([newPost, ...existingLocal]));

  try {
    await supabase.from('posts').insert([newPost]);
  } catch (e) { console.warn("insert into posts error:", e); }

  try {
    await supabase.from('communityposts').insert([newPost]);
  } catch (e) { console.warn("insert into communityposts error:", e); }

  return newPost;
}

export async function addCommunityReply(postId, reply) {
  const newReply = {
    id: 'reply-' + Date.now().toString(),
    ...reply,
    created_at: new Date().toISOString()
  };

  const existingLocal = JSON.parse(localStorage.getItem('grove_custom_posts') || '[]');
  const updatedLocal = existingLocal.map(p => p.id === postId ? { ...p, replies: [...(p.replies || []), newReply] } : p);
  localStorage.setItem('grove_custom_posts', JSON.stringify(updatedLocal));

  try {
    const { data: existingPost } = await supabase
      .from('posts')
      .select('replies')
      .eq('id', postId)
      .maybeSingle();

    const currentReplies = existingPost?.replies || [];
    const updatedReplies = [...currentReplies, newReply];

    await supabase
      .from('posts')
      .update({ replies: updatedReplies })
      .eq('id', postId);
  } catch (e) { console.warn("update posts replies error:", e); }

  try {
    const { data: existingCommPost } = await supabase
      .from('communityposts')
      .select('replies')
      .eq('id', postId)
      .maybeSingle();

    const currentReplies = existingCommPost?.replies || [];
    const updatedReplies = [...currentReplies, newReply];

    await supabase
      .from('communityposts')
      .update({ replies: updatedReplies })
      .eq('id', postId);
  } catch (e) { console.warn("update communityposts replies error:", e); }

  return newReply;
}



export async function likeCommunityPost(postId, currentLikes) {
  const updatedLikes = (currentLikes || 0) + 1;
  const { error } = await supabase
    .from('posts')
    .update({ likes: updatedLikes })
    .eq('id', postId);
  if (error) console.warn("likeCommunityPost update warning:", error);
  return updatedLikes;
}

export async function flagCommunityPost(postId, reason) {
  const { error } = await supabase
    .from('posts')
    .update({ flagged: true, flag_reason: reason })
    .eq('id', postId);
  if (error) console.warn("flagCommunityPost update warning:", error);
  return true;
}

// --- DISCUSSION REQUESTS FOR MODERATORS ---
export async function requestCommunityDiscussion(requestData) {
  const newRequest = {
    id: 'req-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000).toString(),
    ...requestData,
    status: 'pending',
    created_at: new Date().toISOString()
  };
  const { error } = await supabase.from('discussion_requests').insert([newRequest]);
  if (error) console.warn("requestCommunityDiscussion DB warning:", error);
  return newRequest;
}

export async function getDiscussionRequests() {
  const { data, error } = await supabase
    .from('discussion_requests')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn("getDiscussionRequests DB fallback:", error);
    return [];
  }
  return data || [];
}

export async function approveDiscussionRequest(requestId, requestObj) {
  const { error: reqErr } = await supabase
    .from('discussion_requests')
    .update({ status: 'approved' })
    .eq('id', requestId);
  if (reqErr) console.warn("approveDiscussionRequest update warning:", reqErr);

  const newPost = await createCommunityPost({
    author: requestObj.author || 'Parent Member',
    role: requestObj.role || 'PARENT',
    title: requestObj.title,
    category: requestObj.category,
    categoryLabel: requestObj.categoryLabel || 'General',
    content: requestObj.content,
    tags: requestObj.tags || []
  });

  return newPost;
}

// --- ACCOUNT & PROFILE DELETION ---
export async function deleteSubUser(childId) {
  try {
    const { error } = await supabase.from('users').delete().eq('id', childId);
    if (error) console.warn("deleteSubUser DB warning:", error);
  } catch (err) {
    console.warn("deleteSubUser exception:", err);
  }
  return true;
}

export async function deleteUserAccount(userId) {
  try {
    await supabase.from('users').delete().eq('parentId', userId);
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) console.warn("deleteUserAccount DB warning:", error);
  } catch (err) {
    console.warn("deleteUserAccount exception:", err);
  }
  return true;
}

// --- MODERATION DELETION FUNCTIONS ---
export async function deleteFieldTrip(tripId) {
  try {
    const { error } = await supabase.from('fieldtrips').delete().eq('id', tripId);
    if (error) console.warn("deleteFieldTrip DB warning:", error);
  } catch (err) {
    console.warn("deleteFieldTrip exception:", err);
  }
  const existingLocal = JSON.parse(localStorage.getItem('grove_custom_fieldtrips') || '[]');
  localStorage.setItem('grove_custom_fieldtrips', JSON.stringify(existingLocal.filter(t => t.id !== tripId)));
  return true;
}

export async function deleteCommunityPost(postId) {
  try {
    const { error } = await supabase.from('communityposts').delete().eq('id', postId);
    if (error) console.warn("deleteCommunityPost DB warning:", error);
  } catch (err) {
    console.warn("deleteCommunityPost exception:", err);
  }
  const existingLocal = JSON.parse(localStorage.getItem('grove_custom_posts') || '[]');
  localStorage.setItem('grove_custom_posts', JSON.stringify(existingLocal.filter(p => p.id !== postId)));
  return true;
}

export async function deleteBusinessAd(adId) {
  try {
    const { error } = await supabase.from('businessads').delete().eq('id', adId);
    if (error) console.warn("deleteBusinessAd DB warning:", error);
  } catch (err) {
    console.warn("deleteBusinessAd exception:", err);
  }
  const existingLocal = JSON.parse(localStorage.getItem('grove_custom_ads') || '[]');
  localStorage.setItem('grove_custom_ads', JSON.stringify(existingLocal.filter(a => a.id !== adId)));
  return true;
}



// --- ADMIN & SITE OWNER ROLE MANAGEMENT ---
export async function getAllUsers() {
  let dbUsers = [];
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (!error && data) dbUsers = data;
  } catch (err) {
    console.warn("getAllUsers exception:", err);
  }

  const defaultUsers = [
    { id: 'parent-1', name: 'Jane Doe', email: 'jane@example.com', role: 'Parent', assignedRoles: ['Parent'] },
    { id: 'mod-1', name: 'Sarah Miller', email: 'sarah.moderator@thelearninggrove.org', role: 'Moderator', assignedRoles: ['Parent', 'Moderator'] },
    { id: 'admin-1', name: 'Erich (Site Owner)', email: 'owner@thelearninggrove.org', role: 'Admin', assignedRoles: ['Admin', 'Moderator', 'Parent'] }
  ];

  const localCustom = JSON.parse(localStorage.getItem('grove_custom_users') || '[]');
  const combined = [...defaultUsers, ...dbUsers, ...localCustom];
  
  const map = new Map();
  combined.forEach(u => {
    if (u.id) {
      const assigned = u.assignedRoles || [u.role || 'Parent'];
      map.set(u.id, { ...u, assignedRoles: assigned });
    }
  });
  return Array.from(map.values());
}

export async function updateUserRolePermissions(userId, primaryRole, assignedRoles = [primaryRole]) {
  try {
    const { error } = await supabase
      .from('users')
      .update({ role: primaryRole, assignedRoles })
      .eq('id', userId);
    if (error) console.warn("updateUserRolePermissions DB warning:", error);
  } catch (err) {
    console.warn("updateUserRolePermissions exception:", err);
  }

  const localCustom = JSON.parse(localStorage.getItem('grove_custom_users') || '[]');
  const updatedLocal = localCustom.map(u => u.id === userId ? { ...u, role: primaryRole, assignedRoles } : u);
  localStorage.setItem('grove_custom_users', JSON.stringify(updatedLocal));

  return { id: userId, role: primaryRole, assignedRoles };
}
