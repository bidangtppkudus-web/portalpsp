import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vklgawbhehbnxrgqbpds.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Lh_wNOAghjZUBmjSd3EwdA_6OXpt1fD';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const { data, error } = await supabase
    .from('infrastruktur')
    .insert([{
      nama: 'Test Data',
      category: 'jaringan_irigasi',
      kecamatan: 'Undaan',
      desa: 'Undaan Lor',
      status: 'Baik',
      lat: -6.8,
      lng: 110.8,
      foto: ''
    }])
    .select()
    .single();

  if (error) {
    console.error('INSERT ERROR:', error);
  } else {
    console.log('INSERT SUCCESS:', data);
  }
}

testInsert();
