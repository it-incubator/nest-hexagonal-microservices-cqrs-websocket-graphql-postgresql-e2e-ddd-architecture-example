export class MoneyAddedToWalletBalanceEvent {
  constructor(public walletId: string, public addedMoney: number) {}
}
