import { ClubService } from './club.service';
import { ClubEntity } from './club.entity';
import { ClubDto } from './club.dto';
import { plainToInstance } from 'class-transformer';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { SocioEntity } from 'src/socio/socio.entity';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get()
  async findAll() {
    return await this.clubService.findAll();
  }

  @Get(':clubId')
  async findOne(@Param('clubId') clubId: string) {
    return await this.clubService.findOne(clubId);
  }

  @Post()
  async create(@Body() clubDto: ClubDto) {
    const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
    return await this.clubService.create(club);
  }

  @Put(':clubId')
  async update(@Param('clubId') clubId: string, @Body() clubDto: ClubDto) {
    const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
    return await this.clubService.update(clubId, club);
  }

  @Delete(':clubId')
  @HttpCode(204)
  async delete(@Param('clubId') clubId: string) {
    return await this.clubService.delete(clubId);
  }

  @Put(':clubId/members/:socioId')
  async addMemberToClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ): Promise<ClubEntity> {
    return this.clubService.addMemberToClub(clubId, socioId);
  }

  @Get(':clubId/members')
  async findMembersFromClub(
    @Param('clubId') clubId: string,
  ): Promise<SocioEntity[]> {
    return this.clubService.findMembersFromClub(clubId);
  }

  @Get(':clubId/members/:socioId')
  async findMemberFromClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ): Promise<SocioEntity> {
    return this.clubService.findMemberFromClub(clubId, socioId);
  }

  @Delete(':clubId/members/:socioId')
  @HttpCode(204)
  async deleteMemberFromClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ): Promise<ClubEntity> {
    return this.clubService.deleteMemberFromClub(clubId, socioId);
  }

  @Put(':clubId/members')
  async updateMembersFromClub(
    @Param('clubId') clubId: string,
    @Body() socioIds: string[],
  ): Promise<ClubEntity> {
    return await this.clubService.updateMembersFromClub(clubId, socioIds);
  }
}
