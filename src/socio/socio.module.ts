import { Module, forwardRef } from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubModule } from 'src/club/club.module';
import { ClubService } from 'src/club/club.service';
import { SocioController } from './socio.controller';

@Module({
  providers: [SocioService, ClubService],
  imports: [
    TypeOrmModule.forFeature([SocioEntity]),
    forwardRef(() => ClubModule),
  ],
  controllers: [SocioController],
  exports: [SocioService, TypeOrmModule],
})
export class SocioModule {}
