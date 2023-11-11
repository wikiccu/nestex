import { Injectable } from '@nestjs/common'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArticleDto) {
    return await this.prisma.article.create({ data })
  }

  async findAll() {
    return await this.prisma.article.findMany({
      where: { published: true },
    })
  }

  async findDrafts() {
    return await this.prisma.article.findMany({
      where: { published: false },
    })
  }

  async findOne(id: number) {
    return await this.prisma.article.findUnique({
      where: { id },
    })
  }

  async update(id: number, data: UpdateArticleDto) {
    return await this.prisma.article.update({
      where: { id },
      data,
    })
  }

  async remove(id: number) {
    return await this.prisma.article.delete({ where: { id } })
  }
}
