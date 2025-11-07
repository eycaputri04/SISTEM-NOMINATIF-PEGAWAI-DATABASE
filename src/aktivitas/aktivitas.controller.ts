import { Controller, Get, BadRequestException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';

@Controller('aktivitas')
export class AktivitasController {
  @Get('terbaru')
  async getRecent() {
    try {
      // Ambil semua aktivitas terbaru
      const { data: allData, error } = await supabase
        .from('aktivitas')
        .select('id, tipe, aksi, waktu, deskripsi, nip_pegawai') 
        .order('waktu', { ascending: false });

      if (error) throw new BadRequestException(error.message);

      // Ambil 3 terbaru
      const terbaru = allData?.slice(0, 3) ?? [];

      // Hapus sisanya jika lebih dari 3
      const sisanya = allData?.slice(3) ?? [];
      if (sisanya.length > 0) {
        const idsToDelete = sisanya.map((item) => item.id);
        await supabase.from('aktivitas').delete().in('id', idsToDelete);
      }

      // Ambil semua NIP pegawai dari aktivitas terbaru
      const nips = terbaru.map((item) => item.nip_pegawai).filter(Boolean);

      // Ambil nama pegawai dari tabel pegawai
      const { data: pegawaiData, error: pegawaiError } = await supabase
      .from('pegawai')
      .select('NIP, Nama')
      .in('NIP', nips);

      if (pegawaiError) throw new BadRequestException(pegawaiError.message);

      // Map NIP ke nama
      const nipToNama: Record<string, string> = {};
      pegawaiData?.forEach((p) => {
        nipToNama[p.NIP] = p.Nama;
      });

      // Format untuk frontend
      return terbaru.map((item) => ({
        jenis: item.tipe,
        aksi: item.aksi,
        waktu: item.waktu,
        keterangan: item.nip_pegawai
          ? item.deskripsi.replace(item.nip_pegawai, nipToNama[item.nip_pegawai] || '-')
          : item.deskripsi,
      }));
    } catch (err) {
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil aktivitas terbaru'
      );
    }
  }
}
