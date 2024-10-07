import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { OrderEntity } from "./orderEntity";
import { SaleEntity } from "./salesEntity";

@Entity()
export class OrderItemEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  productId!: string;

  @Column()
  name!: string;

  @Column("int")
  quantity!: number;

  @Column("decimal")
  price!: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  order!: OrderEntity;
}
