import { Controller } from '@nestjs/common';
import { PagimationService } from './pagimation.service';

@Controller('pagimation')
export class PagimationController {
  constructor(private readonly pagimationService: PagimationService) {}
}
