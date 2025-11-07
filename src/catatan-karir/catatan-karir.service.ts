import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';
import { CreateCatatanKarirDto } from './dto/create-catatankarir.dto';
import { UpdateCatatanKarirDto } from './dto/update-catatankarir.dto';
import { logAktivitas } from '../utils/logAktivitas';

@Injectable()
export class CatatanKarirService {
  private readonly table = 'catatan_karir';

  /** Ambil nama pegawai berdasarkan NIP */
  private async getNamaPegawai(nip: string): Promise<string> {
    const { data, error } = await supabase
      .from('pegawai')
      .select('Nama')
      .eq('NIP', nip)
      .maybeSingle();

    if (error || !data) {
      console.warn('Gagal mengambil nama pegawai:', error);
      return nip;
    }

    return data.Nama;
  }

  /** CREATE Catatan Karir */
  async create(createDto: CreateCatatanKarirDto) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([createDto])
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(`Gagal menambahkan catatan karir: ${error.message}`);
    }

    if (!data) {
      throw new BadRequestException('Data catatan karir gagal ditambahkan');
    }

    const nama = await this.getNamaPegawai(createDto.NIP);

    await logAktivitas(
      'Catatan Karir',
      'Menambahkan data catatan karir',
      `Menambahkan catatan karir untuk pegawai ${nama}`,
    );

    return {
      message: 'Data catatan karir berhasil ditambahkan',
      data,
    };
  }

  /** UPDATE Catatan Karir */
  async update(id: string, updateDto: UpdateCatatanKarirDto) {
    const { data: existing, error: fetchError } = await supabase
      .from(this.table)
      .select('NIP')
      .eq('id_catatan', id)
      .maybeSingle();

    if (fetchError || !existing) {
      throw new NotFoundException('Data catatan karir tidak ditemukan');
    }

    const { data, error } = await supabase
      .from(this.table)
      .update(updateDto)
      .eq('id_catatan', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(`Gagal memperbarui catatan karir: ${error.message}`);
    }

    const nip = updateDto.NIP || existing.NIP;
    const nama = await this.getNamaPegawai(nip);

    await logAktivitas(
      'Catatan Karir',
      'Memperbarui data catatan karir',
      `Memperbarui catatan karir untuk pegawai ${nama}`,
    );

    return {
      message: 'Data catatan karir berhasil diperbarui',
      data,
    };
  }

  /** READ ALL Catatan Karir */
  async findAll() {
    const { data, error } = await supabase.from(this.table).select('*');

    if (error) {
      throw new BadRequestException('Gagal mengambil data catatan karir');
    }

    return data;
  }

  /** READ ONE Catatan Karir */
  async findOne(id: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id_catatan', id)
      .maybeSingle();

    if (error) {
      throw new BadRequestException('Gagal mengambil data catatan karir');
    }

    if (!data) {
      throw new NotFoundException('Data catatan karir tidak ditemukan');
    }

    return data;
  }

  /** DELETE Catatan Karir */
  async remove(id: string) {
    // Ambil data dulu untuk log
    const { data: existing, error: fetchError } = await supabase
      .from(this.table)
      .select('NIP')
      .eq('id_catatan', id)
      .maybeSingle();

    if (fetchError || !existing) {
      throw new NotFoundException('Data catatan karir tidak ditemukan');
    }

    const nama = await this.getNamaPegawai(existing.NIP);

    const { error: deleteError } = await supabase
      .from(this.table)
      .delete()
      .eq('id_catatan', id);

    if (deleteError) {
      throw new BadRequestException('Gagal menghapus data catatan karir');
    }

    await logAktivitas(
      'Catatan Karir',
      'Menghapus data catatan karir',
      `Menghapus catatan karir milik pegawai ${nama}`,
    );

    return { message: 'Data catatan karir berhasil dihapus' };
  }

  /** CEK KELAYAKAN KENAIKAN PANGKAT */
  async checkEligibility(nip: string) {
    const { data: pegawai } = await supabase
      .from('pegawai')
      .select('Pangkat_Golongan, TMT')
      .eq('NIP', nip)
      .single();

    if (!pegawai) throw new NotFoundException('Pegawai tidak ditemukan');

    const tmt = new Date(pegawai.TMT);
    const tanggalLayak = new Date(tmt.setFullYear(tmt.getFullYear() + 4));
    const today = new Date();

    const status = tanggalLayak <= today ? 'Layak' : 'Belum Layak';
    const potensiPangkat = this.getNextRank(pegawai.Pangkat_Golongan);

    return {
      NIP: nip,
      Pangkat_Sekarang: pegawai.Pangkat_Golongan,
      Potensi_Pangkat_Baru: potensiPangkat,
      Tanggal_Layak: tanggalLayak,
      Status: status,
    };
  }

  /** Fungsi pembantu menentukan pangkat berikutnya */
  private getNextRank(current: string): string {
    const ranks = [
      'II.a', 'II.b', 'II.c', 'II.d',
      'III.a', 'III.b', 'III.c', 'III.d',
      'IV.a', 'IV.b', 'IV.c', 'IV.d', 'IV.e',
    ];
    const index = ranks.indexOf(current);
    return index !== -1 && index < ranks.length - 1
      ? ranks[index + 1]
      : current;
  }
}
