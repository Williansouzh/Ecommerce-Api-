import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1724797750749 implements MigrationInterface {
    name = 'Default1724797750749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_entity" ADD "userId" uuid NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_entity" DROP COLUMN "userId"`);
    }

}
