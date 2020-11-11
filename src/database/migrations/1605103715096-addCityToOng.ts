import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addCityToOng1605103715096 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'ongs',
      new TableColumn({
        name: 'city',
        type: 'varchar',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('ongs', 'city');
  }
}
