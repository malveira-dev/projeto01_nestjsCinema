import { ClassificacaoEtaria } from '@prisma/client';
export declare class CreateFilmeDto {
    titulo: string;
    generoId: number;
    duracao: number;
    classificacaoEtaria: ClassificacaoEtaria;
}
