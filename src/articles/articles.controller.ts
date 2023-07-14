// src/articles/articles.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Logger,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  private readonly logger = new Logger(ArticlesController.name);
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiCreatedResponse({ type: ArticleEntity })
  async create(@Body() createArticleDto: CreateArticleDto) {
    const data = await this.articlesService.create(createArticleDto);
    if (data) {
      this.logger.log(`Created article with id ${data.id}`);
    }
    return new ArticleEntity(data);
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    let query = {};
    if (skip && take) {
      query = { skip: +skip, take: +take };
    }
    const articles = await this.articlesService.findAll(query);
    return articles.map((article) => new ArticleEntity(article));
  }

  @Get('drafts')
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findDrafts(@Query('skip') skip?: string, @Query('take') take?: string) {
    let query = {};
    if (skip && take) {
      query = { skip: +skip, take: +take };
    }
    const drafts = await this.articlesService.findDrafts(query);
    return drafts.map((draft) => new ArticleEntity(draft));
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.findOne(id));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ArticleEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const data = await this.articlesService.update(id, updateArticleDto);
    if (data) {
      this.logger.log(`Updated article with id ${data.id}`);
    }
    return new ArticleEntity(data);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.articlesService.remove(id);
    if (data) {
      this.logger.log(`Deleted article with id ${data.id}`);
    }
    return new ArticleEntity(data);
  }
}
