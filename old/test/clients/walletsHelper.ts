import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { endpoints } from '../../src/bounded-contexts/wallets/api/client-web/wallets.controller';
import { ResultNotification } from 'src/modules/core/validation/notification';
import { CreateWalletCommand } from '../../src/bounded-contexts/wallets/application/use-cases/create-wallet.usecase';
import { MakemoneyTransferCommand } from '../../src/bounded-contexts/wallets/application/use-cases/make-money-transfer-use.case';
import { ClientViewModel } from '../../src/bounded-contexts/clients/db/clients.query.repository';
import { WalletViewModel } from '../../src/bounded-contexts/wallets/db/wallets.query.repository';

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
    command: MakemoneyTransferCommand,
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
