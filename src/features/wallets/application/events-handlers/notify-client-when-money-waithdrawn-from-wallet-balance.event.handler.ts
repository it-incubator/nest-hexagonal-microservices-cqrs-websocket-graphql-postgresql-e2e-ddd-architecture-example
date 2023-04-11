import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SmtpAdapter } from '../../../../modules/core/infrastructure/smtp.adapter';
import { MoneyRemovedFromWalletBalanceEvent } from '../../domain/entities/wallet/events/moneyRemovedFromWalletBalanceEvent';

@EventsHandler(MoneyRemovedFromWalletBalanceEvent)
export class MoneyRemovedFromWalletBalanceEventHandler
  implements IEventHandler<MoneyRemovedFromWalletBalanceEvent>
{
  constructor(private smtp: SmtpAdapter) {}

  async handle(event: MoneyRemovedFromWalletBalanceEvent) {
    console.log(event);

    await this.smtp.send(
      'client.email',
      'client changed',
      `Hey manager. Attention please. Your client  was changed`,
    );
    // logic
  }
}
