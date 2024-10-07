import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { Repository } from "typeorm";
import { CartEntity } from "../entities/cartEntity";
import { CartItemEntity } from "../entities/cartItemEntity";
import { AppDataSource } from "@src/data-source";
import { CartDTO, CartItemDTO } from "@src/application/dtos/cartDTO";
import { NotFoundError } from "@src/utils/api-errors";
import { CartRepositoryInterface } from "@src/domain/repositories/cartRepositoryInterface";

@injectable()
export class CartRepository implements CartRepositoryInterface {
  private repository: Repository<CartEntity>;
  private itemRepository: Repository<CartItemEntity>;
  constructor() {
    this.repository = AppDataSource.getRepository(CartEntity);
    this.itemRepository = AppDataSource.getRepository(CartItemEntity);
  }
  public async addItem(
    userId: string,
    newItem: CartItemDTO
  ): Promise<CartEntity> {
    const cart = await this.getCartOrCreate(userId);

    const existingItem = cart.items.find(
      (item) => item.productId === newItem.productId
    );

    if (existingItem) {
      existingItem.quantity += newItem.quantity;
    } else {
      const createdItem = this.itemRepository.create({
        productId: newItem.productId,
        name: newItem.name,
        quantity: newItem.quantity,
        price: newItem.price,
        cart: cart,
      });
      cart.items.push(createdItem);
    }

    cart.totalPrice = this.calculateTotalPrice(cart.items);

    return await this.repository.save(cart);
  }

  public async updateItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<CartEntity> {
    const cart = await this.getCartOrCreate(userId);
    const item = cart.items.find((item) => item.productId === productId);

    if (!item) {
      throw new NotFoundError("Item not found in the cart");
    }

    item.quantity = quantity;
    cart.totalPrice = this.calculateTotalPrice(cart.items);

    return await this.repository.save(cart);
  }

  public async removeItem(userId: string, productId: string): Promise<void> {
    const cart = await this.getCartOrCreate(userId);
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      throw new NotFoundError("Item not found in the cart");
    }

    cart.items.splice(itemIndex, 1);
    cart.totalPrice = this.calculateTotalPrice(cart.items);

    await this.repository.save(cart);
  }
  public async removeAll(userId: string): Promise<void> {
    const cart = await this.getCartOrCreate(userId);
    cart.items = [];
    cart.totalPrice = 0;
    await this.repository.save(cart);
  }
  public async getCart(userId: string): Promise<CartDTO | null> {
    const cart = await this.repository.findOne({
      where: { userId },
      relations: ["items"],
    });

    return cart ? this.mapToCartDTO(cart) : null;
  }

  private async getCartOrCreate(userId: string): Promise<CartEntity> {
    let cart = await this.repository.findOne({
      where: { userId },
      relations: ["items"],
    });

    if (!cart) {
      cart = this.repository.create({ userId, items: [], totalPrice: 0 });
      await this.repository.save(cart);
    }

    return cart;
  }

  private calculateTotalPrice(items: CartItemEntity[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  private mapToCartDTO(cart: CartEntity): CartDTO {
    return {
      id: cart.id as string,
      userId: cart.userId,
      items: cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: cart.totalPrice,
    };
  }
}
