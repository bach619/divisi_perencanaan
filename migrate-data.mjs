import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Supabase URL or Service Role Key is missing from .env.local');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function migrate() {
  try {
    const jsonPath = path.resolve(process.cwd(), 'app/dashboard/data.json');
    const proposalsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    const dataToInsert = proposalsData.map(proposal => ({
      nama_proposal: proposal.namaProposal,
      kategori: proposal.kategori,
      status: proposal.status,
      jumlah_anggaran: proposal.jumlahAnggaran,
      tanggal_dibuat: proposal.tanggalDibuat,
      executive_summary: proposal.executiveSummary,
    }));

    console.log('Starting migration...');
    const { data, error } = await supabase.from('proposals').insert(dataToInsert);

    if (error) {
      throw error;
    }

    console.log('Migration successful! Data inserted:', data);
  } catch (error) {
    console.error('Migration failed:', error.message);
  }
}

migrate();