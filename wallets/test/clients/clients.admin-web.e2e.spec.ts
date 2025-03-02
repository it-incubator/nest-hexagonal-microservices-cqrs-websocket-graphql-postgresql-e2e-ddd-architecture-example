import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getAppForE2ETesting } from '../../src/tests/tests.utils';
import {
  CreateClientCommand,
  UpdateClientCommand,
  validationsConstants,
} from '../../src/features/clients/domain/entities/client/client.entity';
import { ClientsHelper } from './clientsHelper';
import { endpoints } from '../../src/features/clients/api/admin-web/clients.controller';
import { SecurityGovApiAdapter } from '../../src/features/clients/infrastructure/security-gov-api.adapter';
import { SmtpAdapter } from '../../src/modules/core/infrastructure/smtp.adapter';

jest.setTimeout(10000);

describe('clients.admin-web.controller (e2e)', () => {
  let app: INestApplication;
  let clientsHelper: ClientsHelper;

  const lastNameOfSwindler = 'Bender';

  const securityGovApiAdapterMock: SecurityGovApiAdapter = {
    isSwindler: async (firstName, lastName) => lastName === lastNameOfSwindler,
  };

  const smtpAdapterMock: SmtpAdapter = {
    send: jest.fn(async (to, subject, body) => {
      console.log('mock smtp was called');
      return Promise.resolve();
    }),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    app = await getAppForE2ETesting((module) => {
      module
        .overrideProvider(SecurityGovApiAdapter)
        .useValue(securityGovApiAdapterMock);

      module.overrideProvider(SmtpAdapter).useValue(smtpAdapterMock);
    });

    clientsHelper = new ClientsHelper(app);
  });
  afterAll(async () => {
    await app.close();
  });

  it('notification should be sent when update client ', async () => {
    // create
    const createCommand: CreateClientCommand = {
      firstName: 'dimych',
      lastName: 'kuzyuberdin',
    };

    const createdClientBody = await clientsHelper.createClient(createCommand);

    const createdClient = createdClientBody.data!.item;

    // particular patch update
    const newUpdateCommand: Omit<UpdateClientCommand, 'id'> = {
      address: null,
    };

    await clientsHelper.updateClient(createdClient.id, newUpdateCommand);

    await new Promise((res) => setTimeout(res, 1000));

    expect(smtpAdapterMock.send).toBeCalledTimes(1);
  });

  it('create client', async () => {
    const command: CreateClientCommand = {
      firstName: 'dimych',
      lastName: 'kuzyuberdin',
    };

    const createdClientBody = await clientsHelper.createClient(command);
    // const createdClientBody2 = await clientsHelper.createClient(command);
    // const createdClientBody3 = await clientsHelper.createClient(command);

    const createdClient = createdClientBody.data!.item;

    await clientsHelper.getClient(createdClient.id, {
      expectedClient: createdClient,
    });
  });

  it('try create client with one letter in firstName', async () => {
    const command: CreateClientCommand = {
      firstName: 'd',
      lastName: 'kuzyuberdin',
    };

    const createdClientBody = await clientsHelper.createClient(command, {
      expectedCode: 400,
    });

    expect(createdClientBody.extensions.length).toBe(1);
    expect(createdClientBody.extensions[0].key).toBe('firstName');
  });

  it('try create swindler client', async () => {
    const command: CreateClientCommand = {
      firstName: 'dimych',
      lastName: lastNameOfSwindler,
    };

    const createdClientBody = await clientsHelper.createClient(command, {
      expectedCode: 400,
    });
    const { extensions } = createdClientBody;

    console.log('CREATED BODY!!!', createdClientBody);

    expect(createdClientBody.code).toBe(2);
    expect(extensions.length).toBe(1);
  });
  it('update full client', async () => {
    // create
    const createCommand: CreateClientCommand = {
      firstName: 'dimych',
      lastName: 'kuzyuberdin',
    };

    const createdClientBody = await clientsHelper.createClient(createCommand);

    const createdClient = createdClientBody.data!.item;
    // update 400 (bad address length)
    const updateCommand: Omit<UpdateClientCommand, 'id'> = {
      firstName: 'dimych2',
      lastName: 'kuzyuberdin2',
      address: '-'.repeat(validationsConstants.address.minLength - 1),
    };
    const updateBody = await clientsHelper.updateClient(
      createdClient.id,
      updateCommand,
      {
        expectedCode: 400,
      },
    );
    expect(updateBody.code).toBe(1);
    expect(updateBody.extensions[0].key).toBe('address');

    // update 204 (good address length)
    updateCommand.address = 'good long address value';
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

    const createdClientBody = await clientsHelper.createClient(command);

    const createdClient = createdClientBody.data!.item;
    await clientsHelper.getClient(createdClient.id);

    await request(app.getHttpServer())
      .delete(endpoints.deleteOne(createdClient.id))
      .expect(204);

    await clientsHelper.getClient(createdClient.id, {
      expectedCode: 404,
    });
  });
});
