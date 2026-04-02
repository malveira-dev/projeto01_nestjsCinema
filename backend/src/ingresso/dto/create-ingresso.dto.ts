import { IsInt, IsIn } from 'class-validator';

export class CreateIngressoDto {
  @IsInt()
  sessaoId: number;

  @IsIn(['Inteira', 'Meia'])
  tipo: string;
}
