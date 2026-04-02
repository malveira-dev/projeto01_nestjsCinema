export declare class IngressoItemDto {
    sessaoId: number;
    tipo: string;
}
export declare class LancheItemDto {
    lancheComboId: number;
    quantidade: number;
}
export declare class CreatePedidoDto {
    ingressos: IngressoItemDto[];
    lanches?: LancheItemDto[];
}
