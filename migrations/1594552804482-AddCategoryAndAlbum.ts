import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryAndAlbum1594552804482 implements MigrationInterface {
  name = 'AddCategoryAndAlbum1594552804482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "album" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" integer, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))');
    await queryRunner.query('ALTER TABLE "album" ADD CONSTRAINT "FK_36132c4c7dda6df64a868a1a494" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "album" DROP CONSTRAINT "FK_36132c4c7dda6df64a868a1a494"');
    await queryRunner.query('DROP TABLE "album"');
    await queryRunner.query('DROP TABLE "category"');
  }

}
