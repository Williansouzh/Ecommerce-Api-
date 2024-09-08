import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1725753067568 implements MigrationInterface {
    name = 'Default1725753067568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_entity" DROP COLUMN "transactionId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_entity" ADD "transactionId" character varying NOT NULL`);
    }

}
