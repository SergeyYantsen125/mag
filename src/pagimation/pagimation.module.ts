import { Module } from '@nestjs/common';
import { PagimationService } from './pagimation.service';
import { PagimationController } from './pagimation.controller';

@Module({
  controllers: [PagimationController],
  providers: [PagimationService],
  exports: [PagimationService]
})
export class PagimationModule {}
