import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1724711240079 implements MigrationInterface {
    name = 'Default1724711240079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderId" character varying NOT NULL, "totalPrice" numeric NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_428b558237e70f2cd8462e1bea1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_item_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" character varying NOT NULL, "name" character varying NOT NULL, "quantity" integer NOT NULL, "price" numeric NOT NULL, "orderId" uuid, CONSTRAINT "PK_c12e105219e59720676c72957dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_item_entity" ADD CONSTRAINT "FK_cd7ee8cfd1250200aa78d806f8d" FOREIGN KEY ("orderId") REFERENCES "order_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_entity" DROP CONSTRAINT "FK_cd7ee8cfd1250200aa78d806f8d"`);
        await queryRunner.query(`DROP TABLE "order_item_entity"`);
        await queryRunner.query(`DROP TABLE "order_entity"`);
    }

}
