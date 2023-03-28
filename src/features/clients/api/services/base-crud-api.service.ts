import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '../../../../core/validation/notification';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  BaseQueryRepository,
  ClientsQueryRepository,
  ClientViewModel,
} from '../../db/clients.query.repository';
import { BaseDomainEntity } from '../../../../core/entities/baseDomainEntity';
import {
  Client,
  CreateClientCommand,
} from '../../domain/entities/client.entity';

export class ItemCreatedResultNotification<
  TViewModel,
> extends ResultNotification<{ item: TViewModel }> {
  constructor(viewModel: TViewModel) {
    super();
    this.addData({ item: viewModel });
  }
}

export class BaseCrudApiService<
  TEntity extends BaseDomainEntity,
  TCommand,
  TViewModel,
> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepository: BaseQueryRepository<TViewModel>,
  ) {}
  async create(command) {
    const notification = await this.commandBus.execute<
      TCommand,
      ResultNotification<TEntity>
    >(command);

    console.log('command handled: ', notification);
    if (notification.hasError()) {
      throw new BadRequestException(notification);
    } else {
      const viewModel = await this.queryRepository.getById(
        notification.data.id,
      );
      console.log('viewModel: ', viewModel);
      return new ItemCreatedResultNotification(viewModel);
    }
  }
}

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
