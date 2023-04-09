import { Module } from '@nestjs/common';
import { WalletsController } from './api/client-web/wallets.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyTransfer } from './domain/entities/money-transaction.entity';
import { WalletsCrudApiService } from './api/client-web/services/wallets-crud-api.service';
import { WalletsRepository } from './db/wallets.repository';
import { WalletsQueryRepository } from './db/wallets.query.repository';
import { Wallet } from './domain/entities/wallet.entity';
import { MoneyTransactionsRepository } from './db/money-transactions-repository.service';
import { CreateWalletUseCase } from './application/use-cases/create-wallet.usecase';
import { MakeTransactionUseCase } from './application/use-cases/make-transaction.usecase';
import { MoneyTransactionsQueryRepository } from './db/money-transactions.query.repository';
import { StoreService } from '../clients/store.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Wallet, MoneyTransfer])],
  controllers: [WalletsController],
  providers: [
    WalletsCrudApiService,
    WalletsRepository,
    WalletsQueryRepository,
    MoneyTransactionsQueryRepository,
    MoneyTransactionsRepository,
    CreateWalletUseCase,
    MakeTransactionUseCase,
    StoreService,
    // entityManagerProvider(),
  ],
})
export class WalletsModule {}
