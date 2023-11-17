import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClubModule } from './club/club.module';
import { SocioModule } from './socio/socio.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from './club/club.entity';
import { SocioEntity } from './socio/socio.entity';

@Module({
  imports: [
    ClubModule,
    SocioModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial',
      entities: [ClubEntity, SocioEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
