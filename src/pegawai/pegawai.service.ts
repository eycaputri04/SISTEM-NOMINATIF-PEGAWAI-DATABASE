import { Injectable, BadRequestException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { logAktivitas } from '../utils/logAktivitas';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class PegawaiService {
  private readonly table = 'pegawai';
  private readonly ADMIN_EMAIL = 'eycaputri04@gmail.com';

  constructor(
    private readonly mailerService: MailerService,
  ) {}

  // ================== HELPER ==================
  private addTwoYears(dateStr: string): string {
    const d = new Date(dateStr);
    d.setFullYear(d.getFullYear() + 2);
    return d.toISOString().split('T')[0];
  }

  private async sendEmail(payload: {
    to: string;
    subject: string;
    text: string;
  }) {
    await this.mailerService.sendMail({
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
    });
  }

  // ================== CREATE ==================
  async create(dto: CreatePegawaiDto) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([{ ...dto, kgb_notified: false }])
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        throw new BadRequestException('NIP sudah terdaftar');
      }
      throw new BadRequestException(error.message);
    }

    await logAktivitas(
      'Pegawai',
      'Menambahkan pegawai',
      `Menambahkan pegawai ${dto.Nama}`,
    );

    return { message: 'Pegawai berhasil ditambahkan', data };
  }

  // ================== UPDATE ==================
  async update(nip: string, dto: UpdatePegawaiDto) {
    const mappedDto: any = {
      ...dto,
      NIP: dto.NIP ?? (dto as any).nip,
      Nama: dto.Nama ?? (dto as any).nama,
      Tempat_Tanggal_Lahir:
        dto.Tempat_Tanggal_Lahir ?? (dto as any).tempat_tanggal_lahir,
      Pendidikan_Terakhir:
        dto.Pendidikan_Terakhir ?? (dto as any).pendidikan_terakhir,
      Pangkat_Golongan:
        dto.Pangkat_Golongan ?? (dto as any).pangkat_golongan,
      KGB_Berikutnya:
        dto.KGB_Berikutnya ?? (dto as any).kgb_berikutnya,
      TMT: dto.TMT ?? (dto as any).tmt,
      Jenis_Kelamin:
        dto.Jenis_Kelamin ?? (dto as any).jenis_kelamin,
      Agama: dto.Agama ?? (dto as any).agama,
      Status_Kepegawaian:
        dto.Status_Kepegawaian ?? (dto as any).status_kepegawaian,
      Gaji_Pokok:
        dto.Gaji_Pokok ?? (dto as any).gaji_pokok,
      Jumlah_Anak:
        dto.Jumlah_Anak ?? (dto as any).jumlah_anak,
    };

    // reset notifikasi kalau KGB diedit manual
    if (mappedDto.KGB_Berikutnya) {
      mappedDto.kgb_notified = false;
    }

    const { data, error } = await supabase
      .from(this.table)
      .update(mappedDto)
      .eq('NIP', nip)
      .select()
      .maybeSingle();

    if (error) throw new BadRequestException(error.message);
    if (!data) throw new BadRequestException('Pegawai tidak ditemukan');

    await logAktivitas(
      'Pegawai',
      'Update Pegawai',
      `Memperbarui data pegawai ${data.Nama}`,
    );

    return { message: 'Pegawai berhasil diperbarui', data };
  }

  // ================== READ ==================
  async findAll() {
    const { data, error } = await supabase.from(this.table).select('*');
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(nip: string) {
    const { data } = await supabase
      .from(this.table)
      .select('*')
      .eq('NIP', nip)
      .maybeSingle();

    if (!data) throw new BadRequestException('Pegawai tidak ditemukan');
    return data;
  }

  // ================== PROSES KGB OTOMATIS ==================
  async processKGBOtomatis() {
    const today = new Date().toISOString().split('T')[0];

    const { data: pegawai } = await supabase
      .from(this.table)
      .select('*')
      .lte('KGB_Berikutnya', today)
      .eq('kgb_notified', false);

    for (const p of pegawai ?? []) {
      const kgbBaru = this.addTwoYears(p.KGB_Berikutnya);

      await supabase
        .from(this.table)
        .update({
          kgb_terakhir: p.KGB_Berikutnya,
          KGB_Berikutnya: kgbBaru,
          kgb_notified: true,
        })
        .eq('NIP', p.NIP);

      await logAktivitas(
        'Pegawai',
        'KGB Otomatis',
        `KGB ${p.Nama} diperbarui ke ${kgbBaru}`,
      );

      // EMAIL DIKIRIM KE ADMIN
      await this.sendEmail({
        to: this.ADMIN_EMAIL,
        subject: 'Notifikasi Kenaikan Gaji Berkala (KGB)',
        text: `
          Pegawai : ${p.Nama}
          NIP     : ${p.NIP}
          KGB Lama: ${p.KGB_Berikutnya}
          KGB Baru: ${kgbBaru}
        `,
      });
    }

    return { total_diproses: pegawai?.length ?? 0 };
  }

  // ================== DASHBOARD ==================
  async getDashboardStats() {
    // proses KGB otomatis setiap dashboard dibuka
    await this.processKGBOtomatis();

    const { data: pegawai, error } = await supabase
      .from(this.table)
      .select('*');

    if (error) {
      throw new BadRequestException('Gagal mengambil data dashboard');
    }

    const genderCount = pegawai.reduce(
      (acc, p) => {
        if (p.Jenis_Kelamin?.toLowerCase() === 'laki-laki') acc.lakiLaki++;
        else if (p.Jenis_Kelamin?.toLowerCase() === 'perempuan')
          acc.perempuan++;
        return acc;
      },
      { lakiLaki: 0, perempuan: 0 },
    );

    const today = new Date();

    const upcomingKGB = pegawai
      .filter(p => p.KGB_Berikutnya && new Date(p.KGB_Berikutnya) >= today)
      .sort(
        (a, b) =>
          new Date(a.KGB_Berikutnya).getTime() -
          new Date(b.KGB_Berikutnya).getTime(),
      )
      .slice(0, 2);

    return {
      genderCount,
      upcomingKGB,
    };
  }
}
