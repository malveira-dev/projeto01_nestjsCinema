import { IsArray, IsInt, IsOptional, ValidateNested, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class LancheItemDto {
  @IsInt()
  lancheComboId: number;

  @IsInt()
  @Min(1)
  quantidade: number;
}

export class CreatePedidoDto {
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  ingressoIds?: number[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LancheItemDto)
  lancheItems?: LancheItemDto[];
}
