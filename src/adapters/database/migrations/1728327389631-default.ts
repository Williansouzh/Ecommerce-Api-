import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1728327389631 implements MigrationInterface {
    name = 'Default1728327389631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" ADD "saleDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "transactionId"`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "transactionId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "transactionId"`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "transactionId" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "saleDate"`);
    }

}
