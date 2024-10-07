import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1727907219005 implements MigrationInterface {
    name = 'Default1727907219005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "saleDate"`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "transactionId" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "transactionId"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "saleDate" TIMESTAMP NOT NULL`);
    }

}
