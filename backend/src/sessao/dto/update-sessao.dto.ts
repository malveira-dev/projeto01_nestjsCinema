import { IsOptional, IsInt, IsDateString, IsNumber, Min } from 'class-validator';

export class UpdateSessaoDto {
  @IsInt()
  @IsOptional()
  filmeId?: number;

  @IsInt()
  @IsOptional()
  salaId?: number;

  @IsDateString()
  @IsOptional()
  horarioInicio?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  valorIngresso?: number;
}
