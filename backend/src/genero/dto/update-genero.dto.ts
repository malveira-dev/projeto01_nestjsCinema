import { IsOptional, IsString } from 'class-validator';

export class UpdateGeneroDto {
  @IsString()
  @IsOptional()
  nome?: string;
}
