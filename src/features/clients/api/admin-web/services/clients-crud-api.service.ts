import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import { BaseCrudApiService } from '../../../../../modules/core/api/services/base-crud-api.service';
import {
  Client,
  CreateClientCommand,
} from '../../../domain/entities/client/client.entity';
import {
  ClientsQueryRepository,
  ClientViewModel,
} from '../../../db/clients.query.repository';

@Injectable()
export class ClientCrudApiService extends BaseCrudApiService<
  Client,
  CreateClientCommand,
  ClientViewModel
> {
  constructor(commandBus: CommandBus, queryRepository: ClientsQueryRepository) {
    super(commandBus, queryRepository);
  }
}
