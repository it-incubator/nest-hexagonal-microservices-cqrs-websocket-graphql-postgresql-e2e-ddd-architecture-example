import { INestApplication } from '@nestjs/common';
import { getAppForE2ETesting } from '../../src/tests/tests.utils';
import { ClientsHelper } from '../clients/clientsHelper';
import { SecurityGovApiAdapter } from '../../src/features/clients/infrastructure/security-gov-api.adapter';
import { WalletsHelper } from '../clients/walletsHelper';
import { SmtpAdapter } from '../../src/modules/core/infrastructure/smtp.adapter';

jest.setTimeout(60000);

describe('clients.admin-web.controller (e2e)', () => {
  let app: INestApplication;
  let clientsHelper: ClientsHelper;
  let walletsHelper: WalletsHelper;

  const lastNameOfSwindler = 'Bender';

  const securityGovApiAdapterMock: SecurityGovApiAdapter = {
    isSwindler: async (firstName, lastName) => lastName === lastNameOfSwindler,
  };

  const smtpAdapterMock: SmtpAdapter = {
    send: jest.fn(async (to, subject, body) => {
      return Promise.resolve();
    }),
  };

  beforeAll(async () => {
    app = await getAppForE2ETesting((module) => {
      module
        .overrideProvider(SecurityGovApiAdapter)
        .useValue(securityGovApiAdapterMock);
      module.overrideProvider(SmtpAdapter).useValue(smtpAdapterMock);
    });

    clientsHelper = new ClientsHelper(app);
    walletsHelper = new WalletsHelper(app);
  });
  afterAll(async () => {
    await app.close();
  });

  it('make transaction with concurrency', async () => {
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

    /*const {
      data: { item: wallet3 },
    } = await walletsHelper.createWallet({
      clientId: client2.id,
    });
    console.log(wallet3.id);*/

    const makeTransaction = () =>
      walletsHelper.makeTransaction({
        fromWalletId: wallet1.id,
        toWalletId: wallet2.id,
        amount: 10,
      });
    const makeTransactionBack = () =>
      walletsHelper.makeTransaction({
        fromWalletId: wallet2.id,
        toWalletId: wallet1.id,
        amount: 10,
      });

    const results = await Promise.all([
      makeTransaction(),
      makeTransactionBack(),
      /*  makeTransaction(),
      makeTransactionBack(),
      makeTransaction(),
      makeTransactionBack(),
      makeTransaction(),
      makeTransactionBack(),
      makeTransaction(),
      makeTransactionBack(),*/
    ]);
    const {
      data: { item: transaction1 },
    } = results[0];
    const {
      data: { item: transaction2 },
    } = results[1];
    /*const {
      data: { item: transaction3 },
    } = results[2];*/

    await walletsHelper.getWallet(wallet1.id, {
      expectedItem: {
        id: wallet1.id,
        balance: 100,
        title: expect.any(String),
      },
    });

    await walletsHelper.getWallet(wallet2.id, {
      expectedItem: {
        id: wallet2.id,
        balance: 100,
        title: expect.any(String),
      },
    });
  });

  it.only('make transaction', async () => {
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

    const makeTransaction = () =>
      walletsHelper.makeTransaction({
        fromWalletId: wallet1.id,
        toWalletId: wallet2.id,
        amount: 10,
      });

    const results = await Promise.all([makeTransaction()]);
    const {
      data: { item: transaction1 },
    } = results[0];

    await walletsHelper.getWallet(wallet1.id, {
      expectedItem: {
        id: wallet1.id,
        balance: 100,
        title: expect.any(String),
      },
    });

    await walletsHelper.getWallet(wallet2.id, {
      expectedItem: {
        id: wallet2.id,
        balance: 100,
        title: expect.any(String),
      },
    });

    expect(smtpAdapterMock.send).toBeCalledTimes(2);
  });
});
