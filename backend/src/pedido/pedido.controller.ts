import { Controller, Get, Post, Body, Param, ParseIntPipe, Request } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Body() dto: CreatePedidoDto, @Request() req: any) {
    return this.pedidoService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get('meus')
  findMyOrders(@Request() req: any) {
    return this.pedidoService.findByUsuario(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pedidoService.findOne(id);
  }
}
