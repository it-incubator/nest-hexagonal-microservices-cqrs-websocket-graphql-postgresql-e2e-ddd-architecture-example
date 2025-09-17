import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SmtpAdapter } from '../../../../modules/core/infrastructure/smtp.adapter';
import { MoneyAddedToWalletBalanceEvent } from '../../domain/entities/wallet/events/moneyAddedToWalletBalanceEvent';

@EventsHandler(MoneyAddedToWalletBalanceEvent)
export class NotifyClientWhenMoneyAddedToWalletBalanceEventHandler
  implements IEventHandler<MoneyAddedToWalletBalanceEvent>
{
  constructor(private smtp: SmtpAdapter) {}

  async handle(event: MoneyAddedToWalletBalanceEvent) {
    console.log(event);

    await this.smtp.send(
      'client.email',
      'client changed',
      `Hey manager. Attention please. Your client  was changed`,
    );
    // logic
  }
}
