import { IsArray, IsInt, IsOptional, IsString, ValidateNested, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class IngressoItemDto {
  @IsInt()
  sessaoId: number;

  @IsString()
  tipo: string;
}

export class LancheItemDto {
  @IsInt()
  lancheComboId: number;

  @IsInt()
  @Min(1)
  quantidade: number;
}

export class CreatePedidoDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngressoItemDto)
  ingressos: IngressoItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LancheItemDto)
  lanches?: LancheItemDto[];
}
