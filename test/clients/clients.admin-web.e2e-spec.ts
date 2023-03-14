import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getAppForE2ETesting } from '../../src/tests/tests.utils';
import {
  CreateClientCommand,
  UpdateClientCommand,
} from '../../src/features/clients/domain/entities/client.entity';
import { ClientsHelper } from './clientsHelper';
import { endpoints } from '../../src/features/clients/api/admin-web/clients.controller';

jest.setTimeout(100000);

describe('clients.admin-web.controller (e2e)', () => {
  let app: INestApplication;
  let clientsHelper: ClientsHelper;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
    clientsHelper = new ClientsHelper(app);
  });
  afterAll(async () => {
    await app.close();
  });

  it('create client', async () => {
    const command: CreateClientCommand = {
      firstName: 'dimych',
      lastName: 'kuzyuberdin',
    };

    const createdClient = await clientsHelper.createClient(command);

    await clientsHelper.getClient(createdClient.id, {
      expectedClient: createdClient,
    });
  });
  it('update full client', async () => {
    // create
    const createCommand: CreateClientCommand = {
      firstName: 'dimych',
      lastName: 'kuzyuberdin',
    };

    const createdClient = await clientsHelper.createClient(createCommand);

    // update
    const updateCommand: Omit<UpdateClientCommand, 'id'> = {
      firstName: 'dimych2',
      lastName: 'kuzyuberdin2',
      address: 'address2',
    };
    await clientsHelper.updateClient(createdClient.id, updateCommand);

    // particular patch update
    const newUpdateCommand: Omit<UpdateClientCommand, 'id'> = {
      address: null,
    };

    await clientsHelper.updateClient(createdClient.id, newUpdateCommand);
  });

  it('delete client', async () => {
    const command: CreateClientCommand = {
      firstName: 'dimych',
      lastName: 'kuzyuberdin',
    };

    const createdClient = await clientsHelper.createClient(command);

    await clientsHelper.getClient(createdClient.id);

    await request(app.getHttpServer())
      .delete(endpoints.deleteOne(createdClient.id))
      .expect(204);

    await clientsHelper.getClient(createdClient.id, {
      expectedCode: 404,
    });
  });
});
