import { CreateClientCommand } from '../../src/features/clients/domain/entities/client/client.entity';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ClientViewModel } from '../../dist/features/clients/db/clients.query.repository';
import { endpoints } from '../../src/features/clients/api/admin-web/clients.controller';
import { ResultNotification } from '../../dist/core/validation/notification';

export class ClientsHelper {
  constructor(private app: INestApplication) {}
  async createClient(
    command: CreateClientCommand,
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
      const expectedCreatedClient = {
        id: expect.any(String),
        address: null,
        ...command,
      };

      const {
        body: {
          data: { item: createdClient },
        },
      } = response;

      expect(createdClient).toEqual(expectedCreatedClient);
    }

    return response.body;
  }

  async getClient(
    id: string,
    config: {
      expectedClient?: any;
      expectedCode?: number;
    } = {},
  ) {
    const { body: client } = await request(this.app.getHttpServer())
      .get(endpoints.findOne(id))
      .expect(config.expectedCode ?? 200);

    if (config.expectedClient) {
      expect(client).toEqual(config.expectedClient);
    }

    return client;
  }

  async updateClient(
    id: string,
    updateCommand: any,
    config: {
      expectedCode?: number;
    } = {},
  ) {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    // get client before update
    const clientBeforeUpdate = await this.getClient(id);

    const updateResponse: any = await request(this.app.getHttpServer())
      .patch(endpoints.updateOne(id))
      .send(updateCommand)
      .expect(expectedCode);

    if (expectedCode === HttpStatus.NO_CONTENT) {
      const clientAfterUpdate = await this.getClient(id);

      expect(clientAfterUpdate).toEqual({
        ...clientBeforeUpdate,
        ...updateCommand,
      });
    } else {
      const clientAfterNoUpdate = await this.getClient(id);

      expect(clientAfterNoUpdate).toEqual({
        ...clientBeforeUpdate,
      });
    }

    return updateResponse.body;
  }
}
