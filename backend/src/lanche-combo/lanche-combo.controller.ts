import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { LancheComboService } from './lanche-combo.service';
import { CreateLancheComboDto } from './dto/create-lanche-combo.dto';
import { UpdateLancheComboDto } from './dto/update-lanche-combo.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('lanches-combos')
export class LancheComboController {
  constructor(private readonly lancheComboService: LancheComboService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateLancheComboDto) {
    return this.lancheComboService.create(dto);
  }

  @Get()
  findAll() {
    return this.lancheComboService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lancheComboService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLancheComboDto) {
    return this.lancheComboService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lancheComboService.remove(id);
  }
}
