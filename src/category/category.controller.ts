import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from '../auth/decorators/auth.decorators';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UserDto } from '../user/dto/user.dto';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  async getAllCategories() {
    return this.categoryService.findAll();
  }

  @Auth()
  @HttpCode(200)
  @Post('/create')
  async create() {
    return this.categoryService.create();
  }
  @Get('slug/:slug')
  async getbyslug(@Param('slug') slug: string) {
    return this.categoryService.byslug(slug);
  }

  @Get(':id')
  async getbyid(@Param('id') id: string) {
    return this.categoryService.byId(+id);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @HttpCode(200)
  @Put(':categoryId')
  async update(
    @Param('categoryId') categoryId: string,
    @Body() dto: CategoryDto,
  ) {
    return this.categoryService.updateCategory(+categoryId, dto);
  }

  @Auth()
  @HttpCode(200)
  @Delete(':categoryId')
  async delete(@Param('categoryId') categoryId: string) {
    return this.categoryService.deleteCategory(+categoryId);
  }
}
