const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gdchunmguwmwmxrkpphy.supabase.co';
const supabaseKey = 'sb_publishable_Ta0N_zBREd14WHmSrBNQyQ_1JZFgWV9';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    const { data, error } = await supabase.from('infrastruktur').select('*').limit(1);
    if (error) {
      console.error('Error:', error.message);
    } else {
      console.log('Success:', data);
    }
  } catch (err) {
    console.error('Exception:', err.message);
  }
}

test();
