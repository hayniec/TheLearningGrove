import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function reseed() {
  console.log('🌱 Starting clean database reseed...');

  // 1. Clean out existing entries
  try {
    await supabase.from('curriculum_reviews').delete().neq('id', '0');
    await supabase.from('fieldtrips').delete().neq('id', '0');
    await supabase.from('fieldtrip_reviews').delete().neq('id', '0');
    await supabase.from('businessads').delete().neq('id', '0');
    await supabase.from('communityposts').delete().neq('id', '0');
    await supabase.from('posts').delete().neq('id', '0');
    await supabase.from('users').delete().neq('id', '0');
  } catch (e) {
    console.warn('Cleanup note:', e.message);
  }

  // 2. Insert Site Owners Only
  console.log('Inserting site owners (Eric Haynie & Allison Haynie)...');
  const { error: userErr } = await supabase.from('users').upsert([
    {
      id: 'admin-eric-haynie',
      email: 'eric.haynie@gmail.com',
      password: 'b561d1660c5b9d5526050b73aab5e88c87299175f0b1e8144bbcdb7681cd11d3',
      name: 'Eric Haynie',
      role: 'Admin',
      assignedRoles: ['Admin', 'Moderator', 'Parent']
    },
    {
      id: 'admin-allison-haynie',
      email: 'allison.haynie35@gmail.com',
      password: 'b561d1660c5b9d5526050b73aab5e88c87299175f0b1e8144bbcdb7681cd11d3',
      name: 'Allison Haynie',
      role: 'Admin',
      assignedRoles: ['Admin', 'Moderator', 'Parent']
    }
  ]);
  if (userErr) console.warn('Users upsert note:', userErr.message);

  console.log('✅ Clean database reseed process completed!');
}

reseed();
