import { Injectable } from '@nestjs/common';
import { ClubEntity } from './club.entity'; // Cambiado de SocioEntity a ClubEntity
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { SocioEntity } from 'src/socio/socio.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,
    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>,
  ) {}

  async findAll(): Promise<ClubEntity[]> {
    return await this.clubRepository.find({
      relations: ['socios'],
    });
  }

  async findOne(id: string): Promise<ClubEntity> {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id },
    });
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return club;
  }

  async create(club: ClubEntity): Promise<ClubEntity> {
    if (club.descripcion && club.descripcion.length > 100) {
      throw new BusinessLogicException(
        'The description must not exceed 100 characters',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.clubRepository.save(club);
  }

  async update(id: string, club: ClubEntity): Promise<ClubEntity> {
    const persistedClub: ClubEntity = await this.clubRepository.findOne({
      where: { id },
    });
    if (!persistedClub)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (club.descripcion && club.descripcion.length > 100) {
      throw new BusinessLogicException(
        'The description must not exceed 100 characters',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.clubRepository.save({
      ...persistedClub,
      ...club,
    });
  }

  async delete(id: string) {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id },
    });
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.clubRepository.remove(club);
  }

  async findMembersFromClub(clubId: string): Promise<SocioEntity[]> {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });

    if (!club) {
      throw new BusinessLogicException(
        'Club not found',
        BusinessError.NOT_FOUND,
      );
    }

    return club.socios;
  }

  async updateMembersFromClub(
    clubId: string,
    socioIds: string[],
  ): Promise<ClubEntity> {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });

    if (!club) {
      throw new BusinessLogicException(
        'Club not found',
        BusinessError.NOT_FOUND,
      );
    }

    const updatedSocios = await this.socioRepository.findByIds(socioIds);

    if (updatedSocios.length !== socioIds.length) {
      throw new BusinessLogicException(
        'One or more Socio IDs are invalid',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    club.socios = updatedSocios;

    return await this.clubRepository.save(club);
  }

  async addMemberToClub(clubId: string, socioId: string): Promise<ClubEntity> {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });

    if (!club) {
      throw new BusinessLogicException(
        'Club not found',
        BusinessError.NOT_FOUND,
      );
    }

    const socio = await this.socioRepository.findOne({
      where: { id: socioId },
    });

    if (!socio) {
      throw new BusinessLogicException(
        'Member with the given id not found',
        BusinessError.NOT_FOUND,
      );
    }

    if (!club.socios.some((s) => s.id === socioId)) {
      club.socios.push(socio);
    }

    return await this.clubRepository.save(club);
  }

  async findMemberFromClub(
    clubId: string,
    socioId: string,
  ): Promise<SocioEntity> {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });

    if (!club) {
      throw new BusinessLogicException(
        'Club not found',
        BusinessError.NOT_FOUND,
      );
    }

    const member = club.socios.find((s) => s.id === socioId);

    if (!member) {
      throw new BusinessLogicException(
        'Member not found in the club',
        BusinessError.NOT_FOUND,
      );
    }

    return member;
  }

  async deleteMemberFromClub(
    clubId: string,
    socioId: string,
  ): Promise<ClubEntity> {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });

    if (!club) {
      throw new BusinessLogicException(
        'Club not found',
        BusinessError.NOT_FOUND,
      );
    }

    const memberIndex = club.socios.findIndex((s) => s.id === socioId);

    if (memberIndex > -1) {
      club.socios.splice(memberIndex, 1);
    } else {
      throw new BusinessLogicException(
        'Member not found in the club',
        BusinessError.NOT_FOUND,
      );
    }

    return await this.clubRepository.save(club);
  }
}
