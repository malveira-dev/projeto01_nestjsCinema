import { IsOptional, IsString, IsInt, IsEnum, Min } from 'class-validator';
import { ClassificacaoEtaria } from '@prisma/client';

export class UpdateFilmeDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsInt()
  @IsOptional()
  generoId?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  duracao?: number;

  @IsEnum(ClassificacaoEtaria)
  @IsOptional()
  classificacaoEtaria?: ClassificacaoEtaria;
}
