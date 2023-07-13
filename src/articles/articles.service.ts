import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({ data: createArticleDto });
  }

  findAll(skip?: number, take?: number) {
    if (skip && take) {
      return this.prisma.article.findMany({
        where: { published: true },
        skip,
        take,
      });
    }
    return this.prisma.article.findMany({
      where: { published: true },
      take: 10,
    });
  }

  findDrafts(skip?: number, take?: number) {
    if (skip && take) {
      return this.prisma.article.findMany({
        where: { published: false },
        skip,
        take,
      });
    }
    return this.prisma.article.findMany({
      where: { published: false },
      take: 10,
    });
  }

  findOne(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  remove(id: number) {
    return this.prisma.article.delete({ where: { id } });
  }
}
