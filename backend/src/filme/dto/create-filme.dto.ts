import { IsNotEmpty, IsString, IsInt, IsEnum, Min } from 'class-validator';
import { ClassificacaoEtaria } from '@prisma/client';

export class CreateFilmeDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsInt()
  generoId: number;

  @IsInt()
  @Min(1)
  duracao: number;

  @IsEnum(ClassificacaoEtaria)
  classificacaoEtaria: ClassificacaoEtaria;
}
