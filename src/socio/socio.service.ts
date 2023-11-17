import { Injectable } from '@nestjs/common';
import { SocioEntity } from './socio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { ClubEntity } from 'src/club/club.entity';

@Injectable()
export class SocioService {
  constructor(
    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>,
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,
  ) {}

  async findAll(): Promise<SocioEntity[]> {
    return await this.socioRepository.find({
      relations: ['clubs'],
    });
  }

  async findOne(id: string): Promise<SocioEntity> {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id },
      relations: ['clubs'],
    });
    if (!socio)
      throw new BusinessLogicException(
        'The member with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return socio;
  }

  async create(socio: SocioEntity): Promise<SocioEntity> {
    if (!socio.correo || !socio.correo.includes('@')) {
      throw new BusinessLogicException(
        'The email address must contain an @ symbol',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.socioRepository.save(socio);
  }

  async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
    const persistedSocio: SocioEntity = await this.socioRepository.findOne({
      where: { id },
    });
    if (!persistedSocio)
      throw new BusinessLogicException(
        'The member with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (!socio.correo || !socio.correo.includes('@')) {
      throw new BusinessLogicException(
        'The email address must contain an @ symbol',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.socioRepository.save({
      ...persistedSocio,
      ...socio,
    });
  }

  async delete(id: string) {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id },
    });
    if (!socio)
      throw new BusinessLogicException(
        'The member with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.socioRepository.remove(socio);
  }
}
