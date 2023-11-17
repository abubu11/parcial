import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    socioList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({
        usuario: faker.internet.userName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.past(),
      });
      socioList.push(socio);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a socio', async () => {
    const socio: Partial<SocioEntity> = {
      usuario: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.past(),
    };

    const newSocio: SocioEntity = await service.create(socio as SocioEntity);
    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({
      where: { id: newSocio.id },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.usuario).toEqual(newSocio.usuario);
    expect(storedSocio.correo).toEqual(newSocio.correo);
    expect(storedSocio.fechaNacimiento).toEqual(newSocio.fechaNacimiento);
  });

  it('findAll should return all socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(socioList.length);
  });

  it('findOne should return a socio by id', async () => {
    const storedSocio: SocioEntity = socioList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.usuario).toEqual(storedSocio.usuario);
    expect(socio.correo).toEqual(storedSocio.correo);
    expect(socio.fechaNacimiento).toEqual(storedSocio.fechaNacimiento);
  });

  it('findOne should throw an exception for an invalid socio', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });

  it('update should modify a socio', async () => {
    const socio: SocioEntity = socioList[0];
    socio.usuario = 'New username';

    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({
      where: { id: socio.id },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.usuario).toEqual(socio.usuario);
  });

  it('update should throw an exception for an invalid socio', async () => {
    let socio: SocioEntity = socioList[0];
    socio = {
      ...socio,
      usuario: 'New username',
    };
    await expect(() => service.update('0', socio)).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });

  it('delete should remove a socio', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);

    const deletedSocio: SocioEntity = await repository.findOne({
      where: { id: socio.id },
    });
    expect(deletedSocio).toBeNull();
  });

  it('delete should throw an exception for an invalid socio', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });
});
