import { CreateClientCommand } from '../../src/features/clients/domain/entities/client.entity';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ClientViewModel } from '../../dist/features/clients/db/clients.query.repository';
import { endpoints } from '../../src/features/clients/api/admin-web/clients.controller';

export class ClientsHelper {
  constructor(private app: INestApplication) {}
  async createClient(command: CreateClientCommand): Promise<ClientViewModel> {
    const expectedCreatedClient = {
      id: expect.any(String),
      address: null,
      ...command,
    };

    const { body: createdClient } = await request(this.app.getHttpServer())
      .post(endpoints.create())
      .send(command)
      .expect(201);

    expect(createdClient).toEqual(expectedCreatedClient);

    return createdClient as ClientViewModel;
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

  async updateClient(id: string, updateCommand: any) {
    // get client before update
    const clientBeforeUpdate = await this.getClient(id);

    await request(this.app.getHttpServer())
      .patch(endpoints.updateOne(id))
      .send(updateCommand)
      .expect(204);

    const clientAfterUpdate = await this.getClient(id);

    expect(clientAfterUpdate).toEqual({
      ...clientBeforeUpdate,
      ...updateCommand,
    });
  }
}
