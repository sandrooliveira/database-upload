import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateCategories1601223027746
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const categoryTable = new Table({
      name: 'categories',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'title',
          type: 'varchar',
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

    await queryRunner.createTable(categoryTable);

    const tableForeignKey = new TableForeignKey({
      name: 'TransactionCategory',
      columnNames: ['category_id'],
      referencedTableName: 'categories',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryRunner.createForeignKey('transactions', tableForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categories');
  }
}
