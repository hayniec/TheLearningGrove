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
  const { data, error } = await supabase.from('curricula').select('*');
  if (error) throw error;
  return data.map(r => ({
    ...r,
    onlineResources: !!r.onlineResources,
    selfPaced: !!r.selfPaced,
    classParticipation: !!r.classParticipation,
    videos: !!r.videos,
    gradeLevels: r.gradeLevels ? r.gradeLevels.split(',') : []
  }));
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

// --- FIELD TRIPS ---
export async function getFieldTrips() {
  const { data, error } = await supabase.from('fieldtrips').select('*');
  if (error) throw error;
  return data;
}

export async function addFieldTrip(item) {
  const id = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  const newItem = { ...item, id, userId: item.userId || 'parent-1' };
  const { error } = await supabase.from('fieldtrips').insert([newItem]);
  if (error) throw error;
  return newItem;
}

// --- BUSINESS ADS ---
export async function getBusinessAds() {
  const { data, error } = await supabase.from('businessads').select('*');
  if (error) throw error;
  return data;
}

export async function addBusinessAd(item) {
  const id = item.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  const newItem = { ...item, id, userId: item.userId || 'parent-1' };
  const { error } = await supabase.from('businessads').insert([newItem]);
  if (error) throw error;
  return newItem;
}

// --- RESOURCES ---
export async function getResources() {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('approved', true);
  if (error) throw error;
  return data;
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
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn("getCommunityPosts fallback to initial posts array:", error);
    return null;
  }
  return data;
}

export async function createCommunityPost(post) {
  const newPost = {
    id: 'post-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000).toString(),
    ...post,
    likes: 0,
    replies: [],
    created_at: new Date().toISOString()
  };
  const { error } = await supabase.from('posts').insert([newPost]);
  if (error) {
    console.warn("createCommunityPost error, using local fallback object:", error);
  }
  return newPost;
}

export async function addCommunityReply(postId, reply) {
  const newReply = {
    id: 'reply-' + Date.now().toString(),
    ...reply,
    created_at: new Date().toISOString()
  };

  const { data: existingPost } = await supabase
    .from('posts')
    .select('replies')
    .eq('id', postId)
    .maybeSingle();

  const currentReplies = existingPost?.replies || [];
  const updatedReplies = [...currentReplies, newReply];

  const { error } = await supabase
    .from('posts')
    .update({ replies: updatedReplies })
    .eq('id', postId);

  if (error) console.warn("addCommunityReply update warning:", error);
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
