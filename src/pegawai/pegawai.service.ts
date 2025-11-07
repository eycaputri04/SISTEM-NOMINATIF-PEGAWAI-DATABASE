import { Injectable, BadRequestException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { logAktivitas } from '../utils/logAktivitas';

@Injectable()
export class PegawaiService {
  private readonly table = 'pegawai';

  async create(createPegawaiDto: CreatePegawaiDto) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([createPegawaiDto])
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        throw new BadRequestException('NIP sudah terdaftar');
      }
      throw new BadRequestException(`Gagal menambahkan pegawai: ${error.message}`);
    }

    if (!data) {
      throw new BadRequestException('Pegawai gagal ditambahkan');
    }

    await logAktivitas(
      'Pegawai',
      'Menambahkan pegawai',
      `Menambahkan pegawai ${createPegawaiDto.Nama}`
    );

    return {
      message: 'Pegawai berhasil ditambahkan',
      data,
    };
  }

  async update(nip: string, updateDto: UpdatePegawaiDto) {
    const mappedDto = {
      ...updateDto,
      NIP: (updateDto as any).NIP ?? (updateDto as any).nip,
      Nama: (updateDto as any).Nama ?? (updateDto as any).nama,
      Tempat_Tanggal_Lahir:
        (updateDto as any).Tempat_Tanggal_Lahir ?? (updateDto as any).tempat_tanggal_lahir,
      Pendidikan_Terakhir:
        (updateDto as any).Pendidikan_Terakhir ?? (updateDto as any).pendidikan_terakhir,
      Pangkat_Golongan:
        (updateDto as any).Pangkat_Golongan ?? (updateDto as any).pangkat_golongan,
      KGB_Berikutnya:
        (updateDto as any).KGB_Berikutnya ?? (updateDto as any).kgb_berikutnya,
      TMT: (updateDto as any).TMT ?? (updateDto as any).tmt,
      Jenis_Kelamin:
        (updateDto as any).Jenis_Kelamin ?? (updateDto as any).jenis_kelamin,
      Agama: (updateDto as any).Agama ?? (updateDto as any).agama,
      Status_Kepegawaian:
        (updateDto as any).Status_Kepegawaian ?? (updateDto as any).status_kepegawaian,
      Gaji_Pokok:
        (updateDto as any).Gaji_Pokok ?? (updateDto as any).gaji_pokok,
      Jumlah_Anak:
        (updateDto as any).Jumlah_Anak ?? (updateDto as any).jumlah_anak,
    };

    delete (mappedDto as any).nip;
    delete (mappedDto as any).nama;
    delete (mappedDto as any).tempat_tanggal_lahir;
    delete (mappedDto as any).pendidikan_terakhir;
    delete (mappedDto as any).pangkat_golongan;
    delete (mappedDto as any).kgb_berikutnya;
    delete (mappedDto as any).tmt;
    delete (mappedDto as any).jenis_kelamin;
    delete (mappedDto as any).agama;
    delete (mappedDto as any).status_kepegawaian;
    delete (mappedDto as any).gaji_pokok;
    delete (mappedDto as any).jumlah_anak;
    delete (mappedDto as any).Updated_At;

    const { data, error } = await supabase
      .from(this.table)
      .update(mappedDto)
      .eq('NIP', nip)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        throw new BadRequestException('NIP sudah terdaftar');
      }
      throw new BadRequestException(`Gagal memperbarui pegawai: ${error.message}`);
    }

    if (!data) {
      throw new BadRequestException('Pegawai tidak ditemukan');
    }

    await logAktivitas(
      'Pegawai',
      'Memperbarui data pegawai',
      `Memperbarui data pegawai ${data.Nama}`
    );

    return {
      message: 'Pegawai berhasil diperbarui',
      data,
    };
  }

  async findAll() {
    const { data, error } = await supabase.from(this.table).select('*');
    if (error) {
      throw new BadRequestException('Gagal mengambil data pegawai');
    }
    return data;
  }

  async findOne(nip: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('NIP', nip)
      .maybeSingle();

    if (error) {
      throw new BadRequestException('Gagal mengambil data pegawai');
    }

    if (!data) {
      throw new BadRequestException('Pegawai tidak ditemukan');
    }

    return data;
  }

  async getCount() {
    const { count, error } = await supabase
      .from(this.table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new BadRequestException('Gagal mengambil total pegawai');
    }

    return { count: count ?? 0 };
  }

  async remove(nip: string) {
    // Ambil data pegawai terlebih dahulu sebelum dihapus
    const { data: existingPegawai, error: fetchError } = await supabase
      .from(this.table)
      .select("Nama")
      .eq("NIP", nip)
      .single();

    if (fetchError || !existingPegawai) {
      throw new BadRequestException("Pegawai tidak ditemukan");
    }

    // Hapus data pegawai
    const { error: deleteError } = await supabase
      .from(this.table)
      .delete()
      .eq("NIP", nip);

    if (deleteError) {
      throw new BadRequestException("Gagal menghapus pegawai");
    }

    // Catat aktivitas menggunakan nama pegawai
    await logAktivitas(
      "Pegawai",
      "Menghapus data pegawai",
      `Menghapus data pegawai ${existingPegawai.Nama}`
    );

    return { message: "Pegawai berhasil dihapus" };
  }

  //  Fitur Dashboard 
  async getDashboardStats() {
    const { data: pegawai, error } = await supabase.from(this.table).select('*');
    if (error) {
      throw new BadRequestException('Gagal mengambil data pegawai untuk dashboard');
    }

    // Hitung jumlah berdasarkan gender
    const genderCount = pegawai.reduce(
      (acc, p) => {
        if (p.Jenis_Kelamin?.toLowerCase() === 'laki-laki') acc.lakiLaki += 1;
        else if (p.Jenis_Kelamin?.toLowerCase() === 'perempuan') acc.perempuan += 1;
        return acc;
      },
      { lakiLaki: 0, perempuan: 0 }
    );

    // Ambil 2 pegawai dengan KGB_Berikutnya terdekat
    const upcomingKGB = pegawai
      .filter(p => p.KGB_Berikutnya)
      .sort((a, b) => new Date(a.KGB_Berikutnya).getTime() - new Date(b.KGB_Berikutnya).getTime())
      .slice(0, 2);

    return {
      genderCount,
      upcomingKGB,
    };
  }
}
