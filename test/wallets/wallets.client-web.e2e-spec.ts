import { INestApplication } from '@nestjs/common';
import { getAppForE2ETesting } from '../../src/tests/tests.utils';
import { ClientsHelper } from '../clients/clientsHelper';
import { SecurityGovApiAdapter } from '../../src/features/clients/infrastructure/security-gov-api.adapter';
import { WalletsHelper } from '../clients/walletsHelper';

jest.setTimeout(10000);

describe('clients.admin-web.controller (e2e)', () => {
  let app: INestApplication;
  let clientsHelper: ClientsHelper;
  let walletsHelper: WalletsHelper;

  const lastNameOfSwindler = 'Bender';

  const securityGovApiAdapterMock: SecurityGovApiAdapter = {
    isSwindler: async (firstName, lastName) => lastName === lastNameOfSwindler,
  };

  beforeAll(async () => {
    app = await getAppForE2ETesting((module) => {
      module
        .overrideProvider(SecurityGovApiAdapter)
        .useValue(securityGovApiAdapterMock);
    });

    clientsHelper = new ClientsHelper(app);
    walletsHelper = new WalletsHelper(app);
  });
  afterAll(async () => {
    await app.close();
  });

  it('make transaction', async () => {
    const {
      data: { item: client1 },
    } = await clientsHelper.createClient({
      firstName: 'dimych',
      lastName: 'kuzyuberdin',
    });

    const {
      data: { item: client2 },
    } = await clientsHelper.createClient({
      firstName: 'misha',
      lastName: 'kuzyuberdin',
    });

    const {
      data: { item: wallet1 },
    } = await walletsHelper.createWallet({
      clientId: client1.id,
    });

    const {
      data: { item: wallet2 },
    } = await walletsHelper.createWallet({
      clientId: client2.id,
    });

    const {
      data: { item: transaction1 },
    } = await walletsHelper.makeTransaction({
      fromWalletId: wallet1.id,
      toWalletId: wallet2.id,
      amount: 10,
    });

    await walletsHelper.getWallet(wallet1.id, {
      expectedItem: {
        id: wallet1.id,
        balance: 90,
        title: expect.any(String),
      },
    });

    await walletsHelper.getWallet(wallet2.id, {
      expectedItem: {
        id: wallet2.id,
        balance: 110,
        title: expect.any(String),
      },
    });
  });
});
