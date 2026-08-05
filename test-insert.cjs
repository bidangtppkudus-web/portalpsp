const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gdchunmguwmwmxrkpphy.supabase.co';
const supabaseKey = 'sb_publishable_Ta0N_zBREd14WHmSrBNQyQ_1JZFgWV9';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log("Testing insert...");
  const newItem = {
    id: "test-" + Date.now(),
    nama: "Test Insert",
    category: "jaringan_irigasi",
    kecamatan: "Kota",
    desa: "Test",
    status: "Baik",
    tahun: 2024,
    panjang_terbangun: 100,
    sumber_anggaran: "APBN",
    lat: -6.8,
    lng: 110.8,
    foto: "",
    detail: ""
  };
  
  const { data, error } = await supabase.from('infrastruktur').insert([newItem]);
  if (error) {
    console.error("Insert Error:", error);
  } else {
    console.log("Insert Success:", data);
    
    // Cleanup
    await supabase.from('infrastruktur').delete().eq('id', newItem.id);
  }
}

testInsert();
