import { Module } from '@nestjs/common';
import { WalletsService } from './application/wallets.service';
import { WalletsController } from './api/client-web/wallets.controller';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
