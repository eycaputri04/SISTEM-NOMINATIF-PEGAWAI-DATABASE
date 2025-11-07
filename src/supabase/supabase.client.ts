import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config(); // pastikan env dibaca dulu

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diatur di file .env');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Cek koneksi Supabase dengan query sederhana.
 * Ulangi sampai maksimal maxRetries jika koneksi belum siap.
 */
export async function waitForSupabaseReady(maxRetries = 3): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Coba query ringan, misalnya ambil 1 record dari tabel "pegawai"
      const { error } = await supabase.from('pegawai').select('*').limit(1);

      if (!error) {
        console.log(' Supabase siap digunakan');
        return;
      }

      console.warn(`[Supabase] Gagal konek (percobaan ${i + 1}):`, error.message);
    } catch (err: any) {
      console.warn(`[Supabase] Error koneksi (percobaan ${i + 1}):`, err.message);
    }

    // Tunggu 1 detik sebelum ulang
    await new Promise((r) => setTimeout(r, 1000));
  }

  throw new Error('Supabase gagal siap setelah beberapa percobaan');
}
