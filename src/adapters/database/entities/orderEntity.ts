import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderItemEntity } from "./OrderItemEntity";
import { SaleEntity } from "./salesEntity";

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;
  @Column({ type: "uuid" })
  userId!: string;
  @Column()
  orderId!: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items!: OrderItemEntity[];
  @Column("decimal")
  totalPrice!: number;

  @Column({ default: "pending" })
  status!: string;
  @Column()
  transactionId?: string;
  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @OneToMany(() => SaleEntity, (sale) => sale.order)
  sales!: SaleEntity[];
}
