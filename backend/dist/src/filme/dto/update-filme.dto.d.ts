import { ClassificacaoEtaria } from '@prisma/client';
export declare class UpdateFilmeDto {
    titulo?: string;
    generoId?: number;
    duracao?: number;
    classificacaoEtaria?: ClassificacaoEtaria;
}
