import { Injectable, BadRequestException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';
import { CreatePendidikanDto } from './dto/create-pendidikan.dto';
import { UpdatePendidikanDto } from './dto/update-pendidikan.dto';
import { logAktivitas } from '../utils/logAktivitas';

@Injectable()
export class PendidikanService {
  private readonly table = 'pendidikan';

  /** Ambil nama pegawai dari NIP */
  private async getNamaPegawai(nip: string) {
    if (!nip) return 'Pegawai Tidak Diketahui';

    const { data, error } = await supabase
      .from('pegawai')
      .select('Nama')
      .eq('NIP', nip)
      .maybeSingle();

    if (error || !data) return nip;
    return data.Nama;
  }

  /** CREATE Pendidikan */
  async create(createDto: CreatePendidikanDto) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([createDto])
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Gagal menambahkan pendidikan: ${error.message}`,
      );
    }

    if (!data) {
      throw new BadRequestException('Data pendidikan gagal ditambahkan');
    }

    const namaPegawai = await this.getNamaPegawai(createDto.Pegawai);

    await logAktivitas(
      'Pendidikan',
      'Menambahkan pendidikan',
      `Menambahkan data pendidikan untuk pegawai ${namaPegawai}`,
    );

    return {
      message: 'Data pendidikan berhasil ditambahkan',
      data,
    };
  }

  /** UPDATE Pendidikan */
  async update(id: string, updateDto: UpdatePendidikanDto) {
    const { data, error } = await supabase
      .from(this.table)
      .update(updateDto)
      .eq('ID_Pendidikan', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Gagal memperbarui pendidikan: ${error.message}`,
      );
    }

    if (!data) {
      throw new BadRequestException('Data pendidikan tidak ditemukan');
    }

    const namaPegawai = await this.getNamaPegawai(data.Pegawai);

    await logAktivitas(
      'Pendidikan',
      'Memperbarui pendidikan',
      `Memperbarui data pendidikan untuk pegawai ${namaPegawai}`,
    );

    return {
      message: 'Data pendidikan berhasil diperbarui',
      data,
    };
  }

  /** READ ALL Pendidikan */
  async findAll() {
    const { data, error } = await supabase.from(this.table).select('*');

    if (error) {
      throw new BadRequestException('Gagal mengambil data pendidikan');
    }

    const merged = await Promise.all(
      data.map(async (p) => {
        const namaPegawai = await this.getNamaPegawai(p.Pegawai);
        return { ...p, Nama_Pegawai: namaPegawai };
      }),
    );

    return merged;
  }

  /** READ ONE Pendidikan */
  async findOne(id: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('ID_Pendidikan', id)
      .maybeSingle();

    if (error) {
      throw new BadRequestException('Gagal mengambil data pendidikan');
    }

    if (!data) {
      throw new BadRequestException('Data pendidikan tidak ditemukan');
    }

    const namaPegawai = await this.getNamaPegawai(data.Pegawai);
    return { ...data, Nama_Pegawai: namaPegawai };
  }

  /** COUNT Total Data */
  async getCount() {
    const { count, error } = await supabase
      .from(this.table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new BadRequestException('Gagal mengambil total pendidikan');
    }

    return { count: count ?? 0 };
  }

  /** DELETE Pendidikan */
  async remove(id: string) {
    // Ambil data terlebih dahulu
    const { data: existing, error: fetchError } = await supabase
      .from(this.table)
      .select('Pegawai')
      .eq('ID_Pendidikan', id)
      .maybeSingle();

    if (fetchError || !existing) {
      throw new BadRequestException('Data pendidikan tidak ditemukan');
    }

    // Hapus data
    const { error: deleteError } = await supabase
      .from(this.table)
      .delete()
      .eq('ID_Pendidikan', id);

    if (deleteError) {
      throw new BadRequestException('Gagal menghapus data pendidikan');
    }

    const namaPegawai = await this.getNamaPegawai(existing.Pegawai);

    await logAktivitas(
      'Pendidikan',
      'Menghapus pendidikan',
      `Menghapus data pendidikan milik pegawai ${namaPegawai}`,
    );

    return { message: 'Data pendidikan berhasil dihapus' };
  }
}
