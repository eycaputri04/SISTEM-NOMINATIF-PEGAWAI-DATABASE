import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';
import { CreateStrukturDto } from './dto/create-struktur.dto';
import { UpdateStrukturDto } from './dto/update-struktur.dto';
import { logAktivitas } from '../utils/logAktivitas';

@Injectable()
export class StrukturService {
  private readonly table = 'struktur';

  /** Ambil semua data struktur */
  async findAll(): Promise<any[]> {
    const { data, error } = await supabase.from(this.table).select('*');

    if (error) {
      console.error('[StrukturService.findAll] Supabase error:', error.message);
      throw new BadRequestException('Gagal mengambil data struktur');
    }

    if (!data || data.length === 0) {
      return [];
    }

    const merged = await Promise.all(
      data.map(async (p) => {
        const namaPegawai = await this.getNamaPegawai(p.Pegawai);
        return { ...p, Nama_Pegawai: namaPegawai };
      }),
    );

    return merged;
  }

  /** Ambil satu data struktur berdasarkan ID */
  async findOne(id: string) {
    if (!id) throw new BadRequestException('ID struktur wajib diisi');

    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('ID_Struktur', id)
      .maybeSingle();

    if (error) {
      console.error('[StrukturService.findOne] Supabase error:', error.message);
      throw new BadRequestException('Gagal mengambil data struktur');
    }

    if (!data) throw new NotFoundException('Data struktur tidak ditemukan');
    return data;
  }

  /** Hitung total data struktur */
  async getCount() {
    const { count, error } = await supabase
      .from(this.table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('[StrukturService.getCount] Supabase error:', error.message);
      throw new BadRequestException('Gagal mengambil total struktur');
    }

    return { count: count ?? 0 };
  }

  /** Tambah data struktur baru */
  async create(dto: CreateStrukturDto) {
    if (!dto?.Pegawai || !dto?.Jabatan)
      throw new BadRequestException('Data pegawai dan jabatan wajib diisi');

    const { data, error } = await supabase
      .from(this.table)
      .insert(dto)
      .select()
      .maybeSingle();

    if (error) {
      console.error('[StrukturService.create] Supabase error:', error.message);
      throw new BadRequestException('Gagal menambahkan data struktur');
    }

    const namaPegawai = await this.getNamaPegawai(dto.Pegawai);
    await logAktivitas(
      `Menambahkan struktur baru untuk ${namaPegawai}`,
      'Tambah',
      'Struktur Organisasi',
    );

    return data;
  }

  /** Update data struktur berdasarkan ID */
  async update(id: string, dto: UpdateStrukturDto) {
    if (!id) throw new BadRequestException('ID struktur wajib diisi');

    const { data, error } = await supabase
      .from(this.table)
      .update(dto)
      .eq('ID_Struktur', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('[StrukturService.update] Supabase error:', error.message);
      throw new BadRequestException('Gagal memperbarui data struktur');
    }

    if (!data) throw new NotFoundException('Data struktur tidak ditemukan');

    const namaPegawai = await this.getNamaPegawai(dto.Pegawai ?? data.Pegawai);
    await logAktivitas(
      `Memperbarui data struktur untuk ${namaPegawai}`,
      'Edit',
      'Struktur Organisasi',
    );

    return data;
  }

  /** Hapus data struktur berdasarkan ID */
  async remove(id: string) {
    const existing = await this.findOne(id);
    if (!existing) throw new NotFoundException('Data struktur tidak ditemukan');

    const { error } = await supabase.from(this.table).delete().eq('ID_Struktur', id);

    if (error) {
      console.error('[StrukturService.remove] Supabase error:', error.message);
      throw new BadRequestException('Gagal menghapus data struktur');
    }

    const namaPegawai = await this.getNamaPegawai(existing.Pegawai);
    await logAktivitas(
      `Menghapus data struktur untuk ${namaPegawai}`,
      'Hapus',
      'Struktur Organisasi',
    );

    return { message: 'Data struktur berhasil dihapus' };
  }

  /** Ambil nama pegawai dari tabel pegawai (tanpa loop/retry) */
  private async getNamaPegawai(nip: string): Promise<string> {
    if (!nip) return '-';

    const { data, error } = await supabase
      .from('pegawai')
      .select('Nama')
      .eq('NIP', nip)
      .maybeSingle();

    if (error) {
      console.warn('[getNamaPegawai] Gagal mengambil nama pegawai:', error.message);
      return nip;
    }

    return data?.Nama || nip;
  }
}
