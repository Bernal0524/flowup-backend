import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Obtiene un resumen financiero (ingresos, gastos, balance)
   * para el usuario autenticado.
   */
  @Get('summary')
  getSummary(@Req() req) {
    return this.dashboardService.getSummary(req.user.id);
  }

  /**
   * Devuelve los datos para el gráfico de "Resumen Financiero",
   * agrupando ingresos y gastos por día de los últimos 30 días.
   */
  @Get('chart-data')
  getChartData(@Req() req) {
    return this.dashboardService.getChartData(req.user.id);
  }
}