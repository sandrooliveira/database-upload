import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTransactions1601221851359
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    const transactionsTable = new Table({
      name: 'transactions',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'value',
          type: 'money',
        },
        {
          name: 'title',
          type: 'varchar',
        },
        {
          name: 'type',
          type: 'varchar',
        },
        {
          name: 'category_id',
          type: 'uuid',
          isNullable: true,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    });

    await queryRunner.createTable(transactionsTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
