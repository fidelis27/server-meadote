import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createPets1604582008716 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pets',
        columns: [
          {
            name: 'id',
            type: 'integer',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'ong_id',
            type: 'integer',
          },
          {
            name: 'adopted',
            type: 'boolean',
            default: false,
          },
        ],
        foreignKeys: [
          {
            name: 'PetOng',
            columnNames: ['ong_id'],
            referencedTableName: 'ongs',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pets');
  }
}
