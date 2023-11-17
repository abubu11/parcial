import { Module, forwardRef } from '@nestjs/common';
import { ClubService } from './club.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from './club.entity';
import { ClubController } from './club.controller';
import { SocioModule } from 'src/socio/socio.module';

@Module({
  providers: [ClubService],
  imports: [
    TypeOrmModule.forFeature([ClubEntity]),
    forwardRef(() => SocioModule),
  ],
  controllers: [ClubController],
  exports: [ClubService, TypeOrmModule],
})
export class ClubModule {}
