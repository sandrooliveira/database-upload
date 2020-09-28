import path from 'path';
import fs from 'fs';
import csvParse from 'csv-parse';

import { getRepository, In } from 'typeorm';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import Category from '../models/Category';

interface TransactionCSV {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}

interface CSVInfo {
  transactionsInfo: TransactionCSV[];
  categoryTitles: string[];
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const transactionsRepository = getRepository(Transaction);

    const { transactionsInfo, categoryTitles } = await this.readCSV(fileName);
    const categories = await this.resolveCategories(categoryTitles);

    const transactions = transactionsInfo.map(
      ({ title, type, value, categoryTitle }) => {
        return {
          title,
          type,
          value,
          category: categories.find(
            category => category.title === categoryTitle,
          ),
        };
      },
    );

    const transactionsResolved = transactionsRepository.create(transactions);
    await transactionsRepository.save(transactionsResolved);

    return transactionsResolved;
  }

  private async resolveCategories(
    categoriesTitles: string[],
  ): Promise<Category[]> {
    const categoryRepository = getRepository(Category);

    const existingCategories: Category[] = await categoryRepository.find({
      where: { title: In(categoriesTitles) },
    });

    const outExistingCategories = (categoryTitle: string): boolean => {
      return !existingCategories.some(
        category => category.title === categoryTitle,
      );
    };

    const newCategories = categoriesTitles
      .filter(outExistingCategories)
      .map(categoryTitle => ({ title: categoryTitle }));

    const categoriesResolved: Category[] = categoryRepository.create(
      newCategories,
    );

    await categoryRepository.save(categoriesResolved);

    const categories: Category[] = [
      ...existingCategories,
      ...categoriesResolved,
    ];

    return categories;
  }

  private async readCSV(fileName: string): Promise<CSVInfo> {
    const csvFilePath = path.join(uploadConfig.directory, fileName);
    const readCSVStream = fs.createReadStream(csvFilePath);

    const transactions: TransactionCSV[] = [];
    const categoriesSet = new Set<string>();

    const parseStream = csvParse({
      fromLine: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    parseCSV.on('data', line => {
      const [title, type, value, categoryTitle] = line;

      categoriesSet.add(categoryTitle);

      transactions.push({
        title,
        type,
        value,
        categoryTitle,
      });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return {
      categoryTitles: Array.from(categoriesSet),
      transactionsInfo: transactions,
    };
  }
}

export default ImportTransactionsService;
