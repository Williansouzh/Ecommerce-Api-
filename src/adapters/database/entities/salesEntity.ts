import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { OrderEntity } from "./orderEntity";

@Entity("sales")
export class SaleEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  orderId!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount!: number;

  @Column()
  userId!: string;

  @Column()
  transactionId!: string;

  @Column("timestamp")
  saleDate!: Date;

  @ManyToOne(() => OrderEntity, (order) => order.sales)
  order!: OrderEntity;
}
