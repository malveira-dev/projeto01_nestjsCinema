import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { IngressoService } from './ingresso.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';

@Controller('ingressos')
export class IngressoController {
  constructor(private readonly ingressoService: IngressoService) {}

  @Post()
  create(@Body() dto: CreateIngressoDto) {
    return this.ingressoService.create(dto);
  }

  @Get()
  findAll() {
    return this.ingressoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingressoService.findOne(id);
  }

  @Get('sessao/:sessaoId')
  findBySessao(@Param('sessaoId', ParseIntPipe) sessaoId: number) {
    return this.ingressoService.findBySessao(sessaoId);
  }

  @Get('sessao/:sessaoId/disponibilidade')
  getAvailableSeats(@Param('sessaoId', ParseIntPipe) sessaoId: number) {
    return this.ingressoService.getAvailableSeats(sessaoId);
  }
}
