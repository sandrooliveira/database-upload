// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(transactionId: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    await transactionRepository.delete(transactionId);
  }
}

export default DeleteTransactionService;
