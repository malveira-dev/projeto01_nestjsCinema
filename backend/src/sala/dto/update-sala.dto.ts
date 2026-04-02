import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateSalaDto {
  @IsString()
  @IsOptional()
  numero?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacidade?: number;
}
