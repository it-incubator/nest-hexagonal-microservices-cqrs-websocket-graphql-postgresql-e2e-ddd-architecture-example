import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '../../validation/notification';
import { BadRequestException } from '@nestjs/common';
import { BaseDomainEntity } from '../../entities/baseDomainEntity';
import { BaseQueryRepository } from '../../db/base.query.repository';

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
