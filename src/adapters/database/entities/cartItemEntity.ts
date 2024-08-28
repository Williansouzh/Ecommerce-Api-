import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { CartEntity } from "./cartEntity";

@Entity({ name: "cart_items" })
export class CartItemEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: "uuid" })
  productId!: string;

  @Column()
  name!: string;

  @Column()
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: "CASCADE" })
  cart!: CartEntity;
}
