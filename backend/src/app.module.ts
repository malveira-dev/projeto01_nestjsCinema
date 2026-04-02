import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { GeneroModule } from './genero/genero.module';
import { FilmeModule } from './filme/filme.module';
import { SalaModule } from './sala/sala.module';
import { SessaoModule } from './sessao/sessao.module';
import { IngressoModule } from './ingresso/ingresso.module';
import { LancheComboModule } from './lanche-combo/lanche-combo.module';
import { PedidoModule } from './pedido/pedido.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    GeneroModule,
    FilmeModule,
    SalaModule,
    SessaoModule,
    IngressoModule,
    LancheComboModule,
    PedidoModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
