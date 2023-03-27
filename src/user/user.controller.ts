import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { RefreshTokenDto } from '../auth/dto/RefreshTokenDto';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Auth } from '../auth/decorators/auth.decorators';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {
    return this.userService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @HttpCode(200)
  @Put('profile')
  async uptProfile(@CurrentUser('id') id: number, @Body() userDto: UserDto) {
    return this.userService.updateProfile(id, userDto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(@Param('productId') productId: string, @CurrentUser('id') id: number) {
    return this.userService.toggleFavorite(id, +productId);
  }

  //get profile
  //UPDATEPROFILE
  //togleFAVORIT
}
