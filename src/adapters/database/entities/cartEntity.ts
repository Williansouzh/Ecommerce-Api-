import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CartItemEntity } from "./cartItemEntity";

@Entity({ name: "carts" })
export class CartEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: "uuid" })
  userId!: string;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, {
    cascade: true,
    eager: true,
  })
  items!: CartItemEntity[];

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice!: number;
}
