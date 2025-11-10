import { Controller, Get, Post, Param, Put, Delete, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IngresosService } from './ingresos.service';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/ingresos')
export class IngresosController {
  constructor(private readonly service: IngresosService) {}

  @Get()
  findAll(
    @Req() req,
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('skip') skip?: string,
    @Query('limit') limit?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.findAll(req.user.id, {
      q, category,
      skip: parseInt(skip || '0', 10),
      limit: parseInt(limit || '100', 10),
      from, to,
    });
  }

  @Get('search')
  search(@Req() req, @Query('query') query: string) {
    return this.service.search(req.user.id, query || '');
  }

  @Get('total')
  total(@Req() req, @Query('from') from?: string, @Query('to') to?: string) {
    return this.service.total(req.user.id, from, to);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.service.findOne(req.user.id, id);
  }

  @Post()
  create(@Req() req, @Body() body: CreateIngresoDto) {
    return this.service.create(req.user.id, body);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() data: UpdateIngresoDto) {
    return this.service.update(req.user.id, id, data);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.service.remove(req.user.id, id);
  }
}
