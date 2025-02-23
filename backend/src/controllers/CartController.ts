import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Cart } from '../models/Cart';
import { CartItem } from '../models/CartItem';
import { Book } from '../models/Book';
import { sequelize } from '../database/postgres';

interface OutOfStock {
    bookId: number;
    name: string;
    requested: number;
    available: number;
}
export default class CartController {
  static async getCart(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id?.toString();
      if (!userId) return res.status(400).json({ message: 'User identifier not found' });

      let cart = await Cart.findOne({
        where: { user: userId },
        include: [{ model: CartItem, as: 'items', include: [{ model: Book, as: 'book' }] }],
      });

      if (!cart) return res.status(200).json({ items: [], total: 0, outOfStock: [] });

      const outOfStock: OutOfStock[] = [];
      let total = 0;
      const cartItems = await cart.getItems();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const item of cartItems as any[]) {
        const book = item.getDataValue('book');
        const currentBook = await Book.findByPk(book.id);
        if (!currentBook || item.quantity > currentBook.sellableQuantity) {
          outOfStock.push({
            bookId: book.id,
            name: book.name,
            requested: item.quantity,
            available: currentBook ? currentBook.sellableQuantity : 0,
          });
          await item.destroy();
        } else {
          total += parseFloat(book.price.toString()) * item.quantity;
        }
      }

      cart = await Cart.findOne({
        where: { user: userId },
        include: [{ model: CartItem, as: 'items', include: [{ model: Book, as: 'book' }] }],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = (await cart?.getItems() as any[]).map((item: any) => {
        const book = item.book;
        return {
          id: item.id,
          bookId: book.id,
          name: book.name,
          price: book.price,
          quantity: item.quantity,
          totalCost: parseFloat(book.price.toString()) * item.quantity,
        };
      }) || [];

      return res.status(200).json({
        items,
        total,
        outOfStock,
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  static async addToCart(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { bookId, quantity } = req.body;
    const userId = req.user?.id?.toString();
    if (!userId) return res.status(400).json({ message: 'User identifier not found' });
    
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }
    
    const t = await sequelize.transaction();
    try {
      let cart = await Cart.findOne({ where: { user: userId }, transaction: t });
      if (!cart) {
        cart = await Cart.create({ user: userId }, { transaction: t });
      }
      
      const book = await Book.findByPk(bookId, { transaction: t });
      if (!book) {
        await t.rollback();
        return res.status(404).json({ message: 'Book not found' });
      }
      
      const cartItem = await CartItem.findOne({ where: { cartId: cart.id, bookId }, transaction: t });
      const newQuantity = cartItem ? cartItem.quantity + qty : qty;
      
      if (cartItem) {
        await cartItem.update({ quantity: newQuantity }, { transaction: t });
      } else {
        await CartItem.create({ cartId: cart.id, bookId, quantity: newQuantity }, { transaction: t });
      }
      
      await t.commit();
      return res.status(200).json({ message: 'Book added to cart successfully' });
    } catch (error) {
      await t.rollback();
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  static async removeCartItem(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; 
    const userId = req.user?.id?.toString();
    if (!userId) return res.status(400).json({ message: 'User identifier not found' });
    try {
      const cartItem = await CartItem.findByPk(id);
      if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
      const cart = await Cart.findByPk(cartItem.cartId);
      if (!cart || cart.user !== userId) {
        return res.status(403).json({ message: 'Not authorized to remove this item' });
      }
      await cartItem.destroy();
      const remaining = await CartItem.count({ where: { cartId: cart.id } });
      if (remaining === 0) await cart.destroy();
      return res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  }
}
