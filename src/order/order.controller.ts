import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from '../auth/decorators/auth.decorators';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Auth()
  @Get('/')
  async getStatics(@CurrentUser('id') userId: number) {
    return this.orderService.getAll(userId);
  }
}
