import { HttpStatus, INestApplication } from '@nestjs/common';
import { ResultNotification } from '../../dist/core/validation/notification';
import { ClientViewModel } from '../../dist/features/clients/db/clients.query.repository';
import * as request from 'supertest';
import { endpoints } from '../../src/features/wallets/api/client-web/wallets.controller';
import { CreateWalletCommand } from '../../dist/features/wallets/application/use-cases/create-wallet.usecase';
import { MakeTransactionCommand } from '../../dist/features/wallets/application/use-cases/make-transaction.usecase';
import { WalletViewModel } from '../../dist/features/wallets/db/wallets.query.repository';

export class WalletsHelper {
  constructor(private app: INestApplication) {}

  async createWallet(
    command: CreateWalletCommand,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<ResultNotification<{ item: ClientViewModel }>> {
    const expectedCode = config.expectedCode ?? HttpStatus.CREATED;

    const response = await request(this.app.getHttpServer())
      .post(endpoints.create())
      .send(command)
      .expect(expectedCode);

    if (config.expectedCode === HttpStatus.CREATED) {
      const expectedCreatedEntity = {
        id: expect.any(String),
        address: null,
        ...command,
      };

      const {
        body: {
          data: { item: createdWallet },
        },
      } = response;

      expect(createdWallet).toEqual(expectedCreatedEntity);
    }

    return response.body;
  }

  async getWallet(
    id: string,
    config: {
      expectedItem?: WalletViewModel;
      expectedCode?: number;
    } = {},
  ) {
    const { body: item } = await request(this.app.getHttpServer())
      .get(endpoints.findOne(id))
      .expect(config.expectedCode ?? 200);

    if (config.expectedItem) {
      expect(item).toEqual(config.expectedItem);
    }

    return item;
  }

  async makeTransaction(
    command: MakeTransactionCommand,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<ResultNotification<{ item: ClientViewModel }>> {
    const expectedCode = config.expectedCode ?? HttpStatus.CREATED;

    const response = await request(this.app.getHttpServer())
      .post(endpoints.makeTransaction())
      .send(command)
      .expect(expectedCode);

    if (config.expectedCode === HttpStatus.CREATED) {
      const expectedCreatedItem = {
        id: expect.any(String),
        address: null,
        ...command,
      };

      const {
        body: {
          data: { item: createdItem },
        },
      } = response;

      expect(createdItem).toEqual(expectedCreatedItem);
    }

    return response.body;
  }
}
