import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SessaoService } from './sessao.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('sessoes')
export class SessaoController {
  constructor(private readonly sessaoService: SessaoService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateSessaoDto) {
    return this.sessaoService.create(dto);
  }

  @Get()
  findAll() {
    return this.sessaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sessaoService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSessaoDto) {
    return this.sessaoService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessaoService.remove(id);
  }
}
