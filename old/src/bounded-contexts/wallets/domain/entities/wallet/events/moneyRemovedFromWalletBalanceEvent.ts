export class MoneyRemovedFromWalletBalanceEvent {
  constructor(public walletId: string, public withdrawnMoney: number) {}
}
