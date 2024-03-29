import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MakemoneyTransferCommand } from '../../application/use-cases/make-money-transfer-use.case';
import { WalletsCrudApiService } from './services/wallets-crud-api.service';
import { CreateWalletCommand } from '../../application/use-cases/create-wallet.usecase';
import { WalletsQueryRepository } from '../../db/wallets.query.repository';
import { ItemCreatedResultNotification } from '../../../../modules/core/api/services/base-crud-api.service';
import { MoneyTransactionsQueryRepository } from '../../db/money-transactions.query.repository';
import {DomainResultNotification} from '../../../../modules/core/validation/notification'
import {MoneyTransfer} from '../../domain/entities/money-transaction.entity'

const baseUrl = '/wallets';

export const endpoints = {
  findAll: () => baseUrl,
  findOne: (id: string) => `${baseUrl}/${id}`,
  create: () => baseUrl,
  updateOne: (id: string) => `${baseUrl}/${id}`,
  deleteOne: (id: string) => `${baseUrl}/${id}`,
  makeTransaction: () => `${baseUrl}/transaction`,
};

@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly walletsCrudService: WalletsCrudApiService,
    private readonly walletQueryRepo: WalletsQueryRepository,
    private readonly moneyTransactionsQueryRepository: MoneyTransactionsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  create(@Body() createWalletCommand: CreateWalletCommand) {
    return this.walletsCrudService.create(createWalletCommand);
  }

  @Post('transaction')
  async makeTransaction(@Body() command: MakemoneyTransferCommand) {
    const notification = await this.commandBus.execute<MakemoneyTransferCommand, DomainResultNotification<MoneyTransfer>>(command);

    if (notification.hasError()) {
        return notification;
    }
    const viewModel = this.moneyTransactionsQueryRepository.getById(
      notification.data!.id,
    );
    const viewNotification = new ItemCreatedResultNotification(viewModel);
    return viewNotification;
  }

  @Get()
  findAll() {
    return this.walletQueryRepo.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletQueryRepo.getById(id);
  }
}
