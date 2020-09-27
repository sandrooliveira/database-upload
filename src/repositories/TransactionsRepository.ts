import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const createBalance = (
      balance: Balance,
      transaction: Transaction,
    ): Balance => {
      const newBalance = { ...balance };
      const { value, type } = transaction;

      newBalance[type] = balance[type] + Number(value);
      newBalance.total = newBalance.income - newBalance.outcome;

      return newBalance;
    };

    const transactions = await this.find();

    return transactions.reduce(createBalance, {
      income: 0,
      outcome: 0,
      total: 0,
    });
  }
}

export default TransactionsRepository;
