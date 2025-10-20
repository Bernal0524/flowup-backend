import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async findAll(
    @Req() req,
    @Query('type') type: string,
    @Query('category') category: string,
    @Query('q') q: string,
    @Query('skip') skip: string,
    @Query('limit') limit: string,
  ) {
    const userId = req.user.id;
    return this.transactionsService.findAll(userId, {
      type,
      category,
      q,
      skip: parseInt(skip) || 0,
      limit: parseInt(limit) || 100,
    });
  }

  @Post()
  async create(@Req() req, @Body() body: CreateTransactionDto) {
    return this.transactionsService.create(req.user.id, body);
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    return this.transactionsService.findOne(req.user.id, id);
  }

  
  @Put(':id')
  async updateTransaction(
    @Req() req,
    @Param('id') id: string,
    @Body() data: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(req.user.id, id, data);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.transactionsService.remove(req.user.id, id);
  }
}
