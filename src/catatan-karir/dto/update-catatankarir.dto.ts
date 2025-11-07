import { PartialType } from '@nestjs/swagger';
import { CreateCatatanKarirDto } from './create-catatankarir.dto';

export class UpdateCatatanKarirDto extends PartialType(CreateCatatanKarirDto) {}
