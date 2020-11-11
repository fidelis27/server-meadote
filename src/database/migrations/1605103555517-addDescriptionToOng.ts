import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addDescriptionToOng1605103555517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'ongs',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('ongs', 'description');
  }
}
