import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhotoTable1594563284031 implements MigrationInterface {
  name = 'AddPhotoTable1594563284031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "photo" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "albumId" integer, CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id"))');
    await queryRunner.query('ALTER TABLE "photo" ADD CONSTRAINT "FK_464bcdec1590ef4d623166f1b54" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "photo" DROP CONSTRAINT "FK_464bcdec1590ef4d623166f1b54"');
    await queryRunner.query('DROP TABLE "photo"');
  }

}
