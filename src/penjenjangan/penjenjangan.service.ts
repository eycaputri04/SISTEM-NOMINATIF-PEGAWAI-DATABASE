import { Injectable, BadRequestException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';
import { CreatePenjenjanganDto } from './dto/create-penjenjangan.dto';
import { UpdatePenjenjanganDto } from './dto/update-penjenjangan.dto';
import { logAktivitas } from '../utils/logAktivitas';

@Injectable()
export class PenjenjanganService {
  private readonly table = 'penjenjangan';

  /** Ambil nama pegawai berdasarkan NIP */
  private async getNamaPegawai(nip: string): Promise<string> {
    const { data, error } = await supabase
      .from('pegawai')
      .select('Nama')
      .eq('NIP', nip)
      .maybeSingle();

    if (error) {
      console.warn('Gagal mengambil nama pegawai:', error);
      return nip;
    }

    return data?.Nama || nip;
  }

  /** CREATE Penjenjangan */
  async create(createDto: CreatePenjenjanganDto) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([createDto])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new BadRequestException(
        `Gagal menambahkan data penjenjangan: ${error.message}`,
      );
    }

    if (!data) {
      throw new BadRequestException('Data penjenjangan gagal ditambahkan');
    }

    const nama = await this.getNamaPegawai(createDto.Pegawai);

    await logAktivitas(
      'Penjenjangan',
      'Menambahkan data penjenjangan',
      `Menambahkan data penjenjangan untuk pegawai ${nama}`,
    );

    return {
      message: 'Data penjenjangan berhasil ditambahkan',
      data,
    };
  }

  /** READ ALL Penjenjangan (tanpa retry) */
  async findAll(): Promise<any[]> {
    const { data, error } = await supabase.from(this.table).select('*');

    if (error) {
      console.error('[PenjenjanganService.findAll] Supabase error:', error);
      throw new BadRequestException('Gagal mengambil data penjenjangan');
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

  /** READ ONE Penjenjangan */
  async findOne(id: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('ID_Penjenjangan', id)
      .maybeSingle();

    if (error) {
      console.error('Supabase findOne error:', error);
      throw new BadRequestException('Gagal mengambil data penjenjangan');
    }

    if (!data) {
      throw new BadRequestException('Data penjenjangan tidak ditemukan');
    }

    return data;
  }

  /** UPDATE Penjenjangan */
  async update(id: string, dto: UpdatePenjenjanganDto) {
    const { data, error } = await supabase
      .from(this.table)
      .update(dto)
      .eq('ID_Penjenjangan', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase update error:', error);
      throw new BadRequestException(
        `Gagal memperbarui data penjenjangan: ${error.message}`,
      );
    }

    if (!data) {
      throw new BadRequestException('Data penjenjangan gagal diperbarui');
    }

    const nipPegawai = dto.Pegawai || data.Pegawai;
    const nama = await this.getNamaPegawai(nipPegawai);

    await logAktivitas(
      'Penjenjangan',
      'Memperbarui data penjenjangan',
      `Memperbarui data penjenjangan milik pegawai ${nama}`,
    );

    return {
      message: 'Data penjenjangan berhasil diperbarui',
      data,
    };
  }

  /** DELETE Penjenjangan */
  async remove(id: string) {
    const { data: existing, error: fetchError } = await supabase
      .from(this.table)
      .select('Pegawai')
      .eq('ID_Penjenjangan', id)
      .maybeSingle();

    if (fetchError || !existing) {
      throw new BadRequestException('Data penjenjangan tidak ditemukan');
    }

    const nama = await this.getNamaPegawai(existing.Pegawai);

    const { error: deleteError } = await supabase
      .from(this.table)
      .delete()
      .eq('ID_Penjenjangan', id);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      throw new BadRequestException('Gagal menghapus data penjenjangan');
    }

    await logAktivitas(
      'Penjenjangan',
      'Menghapus data penjenjangan',
      `Menghapus data penjenjangan milik pegawai ${nama}`,
    );

    return { message: 'Data penjenjangan berhasil dihapus' };
  }
}
