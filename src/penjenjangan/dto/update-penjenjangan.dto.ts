import { PartialType } from '@nestjs/swagger';
import { CreatePenjenjanganDto } from './create-penjenjangan.dto';

export class UpdatePenjenjanganDto extends PartialType(CreatePenjenjanganDto) {}
