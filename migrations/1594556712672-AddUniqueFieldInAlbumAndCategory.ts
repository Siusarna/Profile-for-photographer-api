import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueFieldInAlbumAndCategory1594556712672 implements MigrationInterface {
  name = 'AddUniqueFieldInAlbumAndCategory1594556712672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "category" ADD CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name")');
    await queryRunner.query('ALTER TABLE "album" ADD CONSTRAINT "UQ_65a8cb530a4c10f87feaf6891b6" UNIQUE ("name")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "album" DROP CONSTRAINT "UQ_65a8cb530a4c10f87feaf6891b6"');
    await queryRunner.query('ALTER TABLE "category" DROP CONSTRAINT "UQ_23c05c292c439d77b0de816b500"');
  }

}
