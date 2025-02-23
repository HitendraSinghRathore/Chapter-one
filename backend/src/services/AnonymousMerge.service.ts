// src/services/AnonymousMergeService.ts

import { sequelize } from '../database/postgres';
import { Address } from '../models/Address';
import { Book } from '../models/Book';
import { Cart } from '../models/Cart';
import { CartItem } from '../models/CartItem';
import { Order } from '../models/Order';

export async function mergeAnonymousData(
  anonId: string,
  userId: string
): Promise<void> {
  const t = await sequelize.transaction();
  try {
    await Address.update(
      { user: userId },
      { where: { user: anonId }, transaction: t }
    );

    await Order.update(
        { user: userId },
        { where: { user: anonId }, transaction: t }
    );

    const anonCart = await Cart.findOne({ where: { user: anonId }, transaction: t });
    const userCart = await Cart.findOne({ where: { user: userId }, transaction: t });

    if (anonCart) {
      if (userCart) {
        const anonItems = await anonCart.getItems({ transaction: t });
        for (const item of anonItems) {
            const book = await Book.findByPk(item.bookId, { transaction: t });
            if (!book) {
              continue;
            }
          const existing = await CartItem.findOne({
            where: { cartId: userCart.id, bookId: item.bookId },
            transaction: t,
          });
          if (existing) {
            const mergedQuantity = existing.quantity + item.quantity;
            const newQuantity = mergedQuantity > book.sellableQuantity 
              ? book.sellableQuantity 
              : mergedQuantity;
            await existing.update({ quantity: newQuantity }, { transaction: t });
            await item.destroy({ transaction: t });
          } else {
            const newQuantity = item.quantity > book.sellableQuantity 
              ? book.sellableQuantity 
              : item.quantity;
              await item.update({ cartId: userCart.id, quantity: newQuantity }, { transaction: t });
          }
        }
        await anonCart.destroy({ transaction: t });
      } else {
        await anonCart.update({ user: userId }, { transaction: t });
      }
    }
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
