import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ContributeDto } from './dto/contribute.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  findAll(@Req() req, @Query('status') status?: 'ACTIVE'|'COMPLETED'|'PAUSED', @Query('q') q?: string, @Query('skip') skip?: number, @Query('take') take?: number) {
    return this.goalsService.findAll(req.user.id, status, q, Number(skip) || 0, Number(take) || 100);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateGoalDto) {
    return this.goalsService.create(req.user.id, dto);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.goalsService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.goalsService.remove(req.user.id, id);
  }

  @Post(':id/contributions')
  contribute(@Req() req, @Param('id') id: string, @Body() dto: ContributeDto) {
    return this.goalsService.contribute(req.user.id, id, dto);
  }

  @Get(':id/contributions')
  contributions(@Req() req, @Param('id') id: string) {
    return this.goalsService.contributions(req.user.id, id);
  }
}
