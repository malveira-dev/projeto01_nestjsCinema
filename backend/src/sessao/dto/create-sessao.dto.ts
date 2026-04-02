import { IsNotEmpty, IsInt, IsDateString, IsNumber, Min } from 'class-validator';

export class CreateSessaoDto {
  @IsInt()
  filmeId: number;

  @IsInt()
  salaId: number;

  @IsDateString()
  @IsNotEmpty()
  horarioInicio: string;

  @IsNumber()
  @Min(0)
  valorIngresso: number;
}
