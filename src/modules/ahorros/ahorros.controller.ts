import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AhorrosService } from './ahorros.service';
import { CreateAhorroDto } from './dto/create-ahorro.dto';
import { UpdateAhorroDto } from './dto/update-ahorro.dto';
import { CreateAporteDto } from './dto/create-aporte.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/ahorros')
export class AhorrosController {
  constructor(private readonly service: AhorrosService) {}

  // Metas
  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.service.findOne(req.user.id, id);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateAhorroDto) {
    return this.service.create(req.user.id, dto);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateAhorroDto) {
    return this.service.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.service.remove(req.user.id, id);
  }

  // Aportes
  @Post(':id/contribuciones')
  addContribution(@Req() req, @Param('id') goalId: string, @Body() dto: CreateAporteDto) {
    return this.service.addContribution(req.user.id, goalId, dto);
  }

  @Get(':id/contribuciones')
  listContribs(@Req() req, @Param('id') goalId: string) {
    return this.service.listContributions(req.user.id, goalId);
  }

  @Get(':id/progreso')
  progress(@Req() req, @Param('id') goalId: string) {
    return this.service.progress(req.user.id, goalId);
  }
}
