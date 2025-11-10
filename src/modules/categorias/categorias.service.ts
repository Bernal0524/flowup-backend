import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Categoria } from './entities/categoria.entity/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly catRepo: Repository<Categoria>,
  ) {}

  async findAll(userId: string, q?: string, scope?: string) {
    const where: any = { userId };
    if (q) where.name = ILike(`%${q}%`);
    if (scope) where.scope = scope;
    return this.catRepo.find({ where, order: { createdAt: 'DESC' as any } });
  }

  async findOne(userId: string, id: string) {
    const cat = await this.catRepo.findOne({ where: { id, userId } });
    if (!cat) throw new NotFoundException('Categoría no encontrada');
    return cat;
  }

  async create(userId: string, dto: CreateCategoriaDto) {
    const cat = this.catRepo.create({ ...dto, userId });
    return this.catRepo.save(cat);
  }

  async update(userId: string, id: string, dto: UpdateCategoriaDto) {
    const cat = await this.findOne(userId, id);
    const merged = this.catRepo.merge(cat, dto);
    return this.catRepo.save(merged);
  }

  async remove(userId: string, id: string) {
    const cat = await this.findOne(userId, id);
    await this.catRepo.remove(cat);
    return { message: 'Categoría eliminada con éxito.' };
  }
}
