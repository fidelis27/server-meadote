import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addUfToOng1605103853248 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'ongs',
      new TableColumn({
        name: 'uf',
        type: 'varchar',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('ongs', 'uf');
  }
}
