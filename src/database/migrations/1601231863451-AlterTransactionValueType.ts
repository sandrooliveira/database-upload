import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterTransactionValueType1601231863451
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', 'value');
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'value',
        type: 'decimal',
        precision: 10,
        scale: 2,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', 'value');
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'value',
        type: 'money',
      }),
    );
  }
}
