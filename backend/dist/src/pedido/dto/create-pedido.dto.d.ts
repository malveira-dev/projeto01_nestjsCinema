export declare class LancheItemDto {
    lancheComboId: number;
    quantidade: number;
}
export declare class CreatePedidoDto {
    ingressoIds?: number[];
    lancheItems?: LancheItemDto[];
}
