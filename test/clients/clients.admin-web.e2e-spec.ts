import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getAppForE2ETesting } from '../../src/tests/tests.utils';
import { CreateClientCommand } from '../../src/features/clients/domain/entities/client.entity';

jest.setTimeout(100000);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await getAppForE2ETesting();
  });
  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer()).get('/clients').expect(200).expect([]);

    const dto: CreateClientCommand = {
      firstName: 'dimych',
      lastName: 'kuzyuberdin',
    };

    const expectedCreatedClient = {
      id: expect.any(String),
      ...dto,
    };

    const { body: createdClient } = await request(app.getHttpServer())
      .post('/clients')
      .send(dto)
      .expect(201);

    expect(createdClient).toEqual(expectedCreatedClient);

    const { body: allClients } = await request(app.getHttpServer())
      .get('/clients')
      .expect(200);

    expect(allClients).toEqual([expectedCreatedClient]);
  });
});
