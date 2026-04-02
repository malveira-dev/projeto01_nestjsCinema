import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateLancheComboDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  preco?: number;

  @IsString()
  @IsOptional()
  itens?: string;
}
