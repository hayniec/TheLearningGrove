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
  const localCurricula = JSON.parse(localStorage.getItem('grove_custom_curricula') || '[]');
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

  let dbCurricula = [];
  try {
    const { data, error } = await supabase.from('curricula').select('*');
    if (!error && data && data.length > 0) {
      dbCurricula = data.map(r => ({
        ...r,
        onlineResources: !!r.onlineResources,
        selfPaced: !!r.selfPaced,
        classParticipation: !!r.classParticipation,
        videos: !!r.videos,
        gradeLevels: typeof r.gradeLevels === 'string' ? r.gradeLevels.split(',').filter(Boolean) : (r.gradeLevels || [])
      }));
    }
  } catch (err) {
    console.warn("getCurricula exception:", err);
  }

  const mergedMap = new Map();
  defaultSampleCurricula.forEach(c => mergedMap.set(c.id, c));
  dbCurricula.forEach(c => mergedMap.set(c.id, c));
  localCurricula.forEach(c => mergedMap.set(c.id, c));
  return Array.from(mergedMap.values());
}

export async function getCurriculumReviews(curriculumId) {
  const localReviews = JSON.parse(localStorage.getItem(`grove_reviews_${curriculumId}`) || '[]');
  let dbReviews = [];
  try {
    const { data, error } = await supabase
      .from('curriculum_reviews')
      .select('*')
      .eq('curriculumId', curriculumId)
      .order('createdAt', { ascending: false });
    if (!error && data) dbReviews = data;
  } catch (err) {
    console.warn("getCurriculumReviews exception:", err);
  }

  const defaultSampleReviews = [];

  const map = new Map();
  defaultSampleReviews.forEach(r => map.set(r.id, r));
  dbReviews.forEach(r => map.set(r.id, r));
  localReviews.forEach(r => map.set(r.id, r));
  return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
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
    gradeLevels: item.gradeLevels ? (Array.isArray(item.gradeLevels) ? item.gradeLevels : item.gradeLevels.split(',')) : [],
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
    websiteUrl: item.websiteUrl || item.purchaseUrl || '',
    createdAt: Date.now()
  };

  // 1. Save to local storage for immediate offline / zero-fail operation
  const existingLocalCurr = JSON.parse(localStorage.getItem('grove_custom_curricula') || '[]');
  localStorage.setItem('grove_custom_curricula', JSON.stringify([newCurriculumItem, ...existingLocalCurr]));

  const existingLocalRev = JSON.parse(localStorage.getItem(`grove_reviews_${id}`) || '[]');
  localStorage.setItem(`grove_reviews_${id}`, JSON.stringify([newReviewItem, ...existingLocalRev]));

  // 2. Best-effort Supabase insert
  try {
    const dbCurriculumPayload = {
      ...newCurriculumItem,
      gradeLevels: Array.isArray(newCurriculumItem.gradeLevels) ? newCurriculumItem.gradeLevels.join(',') : newCurriculumItem.gradeLevels
    };
    await supabase.from('curricula').insert([dbCurriculumPayload]);
  } catch (currErr) {
    console.warn("addCurriculum DB warning, stored locally:", currErr);
  }

  try {
    await supabase.from('curriculum_reviews').insert([newReviewItem]);
  } catch (revErr) {
    console.warn("addCurriculumReview DB warning, stored locally:", revErr);
  }

  return newCurriculumItem;
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
    websiteUrl: reviewItem.websiteUrl || reviewItem.purchaseUrl || '',
    createdAt: Date.now()
  };

  // 1. Save locally for instant persistence
  const existingLocal = JSON.parse(localStorage.getItem(`grove_reviews_${curriculumId}`) || '[]');
  localStorage.setItem(`grove_reviews_${curriculumId}`, JSON.stringify([newReview, ...existingLocal]));

  // 2. Best-effort Supabase insert
  try {
    await supabase.from('curriculum_reviews').insert([newReview]);
  } catch (insErr) {
    console.warn("addCurriculumReview DB insert warning, stored locally:", insErr);
  }

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
  'eric.haynie@gmail'
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

  const defaultSampleFieldTrips = [];

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
  const defaultSampleAds = [];

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
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();

  const defaultKnownUsers = [
    {
      id: 'admin-eric-haynie',
      email: 'eric.haynie@gmail.com',
      name: 'Eric Haynie',
      role: 'Admin',
      assignedRoles: ['Admin', 'Moderator', 'Parent']
    },
    {
      id: 'admin-allison-haynie',
      email: 'allison.haynie35@gmail.com',
      name: 'Allison Haynie',
      role: 'Admin',
      assignedRoles: ['Admin', 'Moderator', 'Parent']
    }
  ];

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', cleanEmail)
      .maybeSingle();
    if (!error && data) return data;
  } catch (err) {
    console.warn("getUserByEmail DB exception:", err);
  }

  // Fallback to local custom users
  const localUsers = JSON.parse(localStorage.getItem('grove_custom_users') || '[]');
  const foundLocal = localUsers.find(u => u.email && u.email.toLowerCase() === cleanEmail);
  if (foundLocal) return foundLocal;

  // Fallback to default known users
  const foundKnown = defaultKnownUsers.find(u => u.email.toLowerCase() === cleanEmail);
  if (foundKnown) return foundKnown;

  return null;
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

  const defaultSamplePosts = [];

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

export async function deleteUserAccount(userId, userObject) {
  const targetId = userId;

  // 1. Delete linked student/child subusers
  try {
    await supabase.from('users').delete().eq('parentId', targetId);
    await supabase.from('users').delete().eq('parentid', targetId);
  } catch (e) {
    console.warn("deleteUserAccount subusers warning:", e);
  }

  // 2. Anonymize Curriculum Reviews
  try {
    await supabase
      .from('curriculum_reviews')
      .update({ userId: 'former-grove-parent', userName: 'Former Grove Parent' })
      .eq('userId', targetId);
  } catch (e) {
    console.warn("Anonymize curriculum_reviews warning:", e);
  }

  // 3. Anonymize Field Trips
  try {
    await supabase
      .from('fieldtrips')
      .update({ userId: 'former-grove-parent', submittedBy: 'Former Grove Parent' })
      .eq('userId', targetId);
  } catch (e) {
    console.warn("Anonymize fieldtrips warning:", e);
  }

  // 4. Anonymize Field Trip Reviews
  try {
    await supabase
      .from('fieldtrip_reviews')
      .update({ userId: 'former-grove-parent', userName: 'Former Grove Parent' })
      .eq('userId', targetId);
  } catch (e) {
    console.warn("Anonymize fieldtrip_reviews warning:", e);
  }

  // 5. Anonymize Business Ads
  try {
    await supabase
      .from('businessads')
      .update({ userId: 'former-grove-parent', owner: 'Former Grove Parent', submittedBy: 'Former Grove Parent' })
      .eq('userId', targetId);
  } catch (e) {
    console.warn("Anonymize businessads warning:", e);
  }

  // 6. Anonymize Community Posts
  try {
    await supabase
      .from('communityposts')
      .update({ userId: 'former-grove-parent', author: 'Former Grove Parent' })
      .eq('userId', targetId);

    await supabase
      .from('posts')
      .update({ userId: 'former-grove-parent', author: 'Former Grove Parent' })
      .eq('userId', targetId);
  } catch (e) {
    console.warn("Anonymize communityposts warning:", e);
  }

  // 7. Delete User Credential Row (Scrubbing PII)
  try {
    const { error } = await supabase.from('users').delete().eq('id', targetId);
    if (error) console.warn("deleteUserAccount DB warning:", error);
  } catch (err) {
    console.warn("deleteUserAccount exception:", err);
  }

  // Clean local custom user records
  const localCustomUsers = JSON.parse(localStorage.getItem('grove_custom_users') || '[]');
  localStorage.setItem('grove_custom_users', JSON.stringify(localCustomUsers.filter(u => u.id !== targetId && u.parentId !== targetId && u.parentid !== targetId)));

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

export async function deleteCommunityReply(postId, replyId) {
  const existingLocal = JSON.parse(localStorage.getItem('grove_custom_posts') || '[]');
  const updatedLocal = existingLocal.map(p => {
    if (p.id === postId) {
      return { ...p, replies: (p.replies || []).filter(r => r.id !== replyId) };
    }
    return p;
  });
  localStorage.setItem('grove_custom_posts', JSON.stringify(updatedLocal));

  try {
    const { data: existingPost } = await supabase
      .from('posts')
      .select('replies')
      .eq('id', postId)
      .maybeSingle();

    if (existingPost && existingPost.replies) {
      const updated = existingPost.replies.filter(r => r.id !== replyId);
      await supabase.from('posts').update({ replies: updated }).eq('id', postId);
    }
  } catch (e) {
    console.warn("deleteCommunityReply DB warning:", e);
  }

  try {
    const { data: existingCommPost } = await supabase
      .from('communityposts')
      .select('replies')
      .eq('id', postId)
      .maybeSingle();

    if (existingCommPost && existingCommPost.replies) {
      const updated = existingCommPost.replies.filter(r => r.id !== replyId);
      await supabase.from('communityposts').update({ replies: updated }).eq('id', postId);
    }
  } catch (e) {
    console.warn("deleteCommunityReply DB warning 2:", e);
  }

  return true;
}

export async function deleteCommunityPost(postId) {
  try {
    const { error } = await supabase.from('communityposts').delete().eq('id', postId);
    if (error) console.warn("deleteCommunityPost DB warning:", error);
  } catch (err) {
    console.warn("deleteCommunityPost exception:", err);
  }
  try {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) console.warn("deletePost DB warning:", error);
  } catch (err) {
    console.warn("deletePost exception:", err);
  }
  const existingLocal = JSON.parse(localStorage.getItem('grove_custom_posts') || '[]');
  localStorage.setItem('grove_custom_posts', JSON.stringify(existingLocal.filter(p => p.id !== postId)));
  return true;
}

export async function deleteCurriculum(curriculumId) {
  try {
    const { error } = await supabase.from('curricula').delete().eq('id', curriculumId);
    if (error) console.warn("deleteCurriculum DB warning:", error);
  } catch (err) {
    console.warn("deleteCurriculum exception:", err);
  }
  const existingLocal = JSON.parse(localStorage.getItem('grove_custom_curricula') || '[]');
  localStorage.setItem('grove_custom_curricula', JSON.stringify(existingLocal.filter(c => c.id !== curriculumId)));
  return true;
}

// --- FIELD TRIP REVIEWS ---
export async function getFieldTripReviews(tripId) {
  const localReviews = JSON.parse(localStorage.getItem(`grove_trip_reviews_${tripId}`) || '[]');
  let dbReviews = [];
  try {
    const { data, error } = await supabase
      .from('fieldtrip_reviews')
      .select('*')
      .eq('tripId', tripId)
      .order('createdAt', { ascending: false });
    if (!error && data) dbReviews = data;
  } catch (err) {
    console.warn("getFieldTripReviews exception:", err);
  }

  const map = new Map();
  dbReviews.forEach(r => map.set(r.id, r));
  localReviews.forEach(r => map.set(r.id, r));
  return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function addFieldTripReview(tripId, reviewItem) {
  const id = `trip-review-${tripId}-${Date.now().toString().slice(-4)}`;
  const newReview = {
    id,
    tripId,
    userId: reviewItem.userId || 'parent-1',
    userName: reviewItem.userName || 'Sarah Jenkins',
    rating: Number(reviewItem.rating) || 5,
    favoritePart: reviewItem.favoritePart || '',
    description: reviewItem.description || '',
    createdAt: Date.now()
  };

  const existingLocal = JSON.parse(localStorage.getItem(`grove_trip_reviews_${tripId}`) || '[]');
  localStorage.setItem(`grove_trip_reviews_${tripId}`, JSON.stringify([newReview, ...existingLocal]));

  try {
    await supabase.from('fieldtrip_reviews').insert([newReview]);
  } catch (err) {
    console.warn("addFieldTripReview DB warning, saved locally:", err);
  }

  return newReview;
}

export async function deleteFieldTripReview(reviewId, tripId) {
  try {
    const { error } = await supabase.from('fieldtrip_reviews').delete().eq('id', reviewId);
    if (error) console.warn("deleteFieldTripReview DB warning:", error);
  } catch (err) {
    console.warn("deleteFieldTripReview exception:", err);
  }
  if (tripId) {
    const existingLocal = JSON.parse(localStorage.getItem(`grove_trip_reviews_${tripId}`) || '[]');
    localStorage.setItem(`grove_trip_reviews_${tripId}`, JSON.stringify(existingLocal.filter(r => r.id !== reviewId)));
  }
  return true;
}

// --- CONTENT FLAGGING ---
export async function flagContentItem(itemType, itemId, reason, flaggedBy) {
  const flagObj = {
    id: `flag-${Date.now()}`,
    itemType, // 'post', 'reply', 'curriculum_review', 'trip_review'
    itemId,
    reason,
    flaggedBy: flaggedBy ? flaggedBy.name || flaggedBy.email || flaggedBy.id : 'Anonymous Parent',
    createdAt: new Date().toISOString()
  };

  const existingFlags = JSON.parse(localStorage.getItem('grove_custom_flags') || '[]');
  localStorage.setItem('grove_custom_flags', JSON.stringify([flagObj, ...existingFlags]));

  try {
    await supabase.from('content_flags').insert([flagObj]);
  } catch (err) {
    console.warn("flagContentItem DB warning, saved locally:", err);
  }

  return flagObj;
}

export async function getFlaggedContentItems() {
  const localFlags = JSON.parse(localStorage.getItem('grove_custom_flags') || '[]');
  let dbFlags = [];
  try {
    const { data, error } = await supabase.from('content_flags').select('*').order('createdAt', { ascending: false });
    if (!error && data) dbFlags = data;
  } catch (err) {
    console.warn("getFlaggedContentItems exception:", err);
  }

  const map = new Map();
  dbFlags.forEach(f => map.set(f.id, f));
  localFlags.forEach(f => map.set(f.id, f));
  return Array.from(map.values());
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

export async function deleteCurriculumReview(reviewId) {
  try {
    const { error } = await supabase.from('curriculum_reviews').delete().eq('id', reviewId);
    if (error) console.warn("deleteCurriculumReview DB warning:", error);
  } catch (err) {
    console.warn("deleteCurriculumReview exception:", err);
  }
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
    { id: 'admin-eric-haynie', name: 'Eric Haynie', email: 'eric.haynie@gmail.com', role: 'Admin', assignedRoles: ['Admin', 'Moderator', 'Parent'] },
    { id: 'admin-allison-haynie', name: 'Allison Haynie', email: 'allison.haynie35@gmail.com', role: 'Admin', assignedRoles: ['Admin', 'Moderator', 'Parent'] }
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

// --- USER ACCOUNT & PROFILE MANAGEMENT ---
export async function updateUserProfile(userId, updates) {
  const payload = {
    name: updates.name,
    email: updates.email,
    bio: updates.bio || '',
    stateRegion: updates.stateRegion || ''
  };

  try {
    const { data, error } = await supabase
      .from('users')
      .update(payload)
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) console.warn("updateUserProfile DB warning:", error);
    if (data) return data;
  } catch (err) {
    console.warn("updateUserProfile exception:", err);
  }

  // Update in local storage custom users fallback
  const localCustom = JSON.parse(localStorage.getItem('grove_custom_users') || '[]');
  const updatedLocal = localCustom.map(u => u.id === userId ? { ...u, ...payload } : u);
  localStorage.setItem('grove_custom_users', JSON.stringify(updatedLocal));

  return { id: userId, ...payload };
}

export async function changeUserPassword(userId, currentPassword, newPassword) {
  const oldHashed = await hashPassword(currentPassword);
  const newHashed = await hashPassword(newPassword);

  let { data: user } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
  
  if (user && user.password && user.password !== oldHashed) {
    throw new Error("Current password does not match.");
  }

  try {
    const { error } = await supabase
      .from('users')
      .update({ password: newHashed })
      .eq('id', userId);
    if (error) console.warn("changeUserPassword DB warning:", error);
  } catch (err) {
    console.warn("changeUserPassword exception:", err);
  }

  // Update local custom users fallback
  const localCustom = JSON.parse(localStorage.getItem('grove_custom_users') || '[]');
  const updatedLocal = localCustom.map(u => u.id === userId ? { ...u, password: newHashed } : u);
  localStorage.setItem('grove_custom_users', JSON.stringify(updatedLocal));

  return true;
}
