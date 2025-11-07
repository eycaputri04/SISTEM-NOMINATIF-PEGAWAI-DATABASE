import { PartialType } from '@nestjs/swagger';
import { CreatePendidikanDto } from './create-pendidikan.dto';

export class UpdatePendidikanDto extends PartialType(CreatePendidikanDto) {}
