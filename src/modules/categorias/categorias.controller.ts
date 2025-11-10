import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/categorias')
export class CategoriasController {
  constructor(private readonly service: CategoriasService) {}

  @Get()
  findAll(
    @Req() req,
    @Query('q') q?: string,
    @Query('scope') scope?: string, // INCOME|EXPENSE|SAVING|INVESTMENT|GENERAL
  ) {
    return this.service.findAll(req.user.id, q, scope);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.service.findOne(req.user.id, id);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateCategoriaDto) {
    return this.service.create(req.user.id, dto);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateCategoriaDto) {
    return this.service.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.service.remove(req.user.id, id);
  }
}
