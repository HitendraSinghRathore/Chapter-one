import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItems';
import { Cart } from '../models/Cart';
import { CartItem } from '../models/CartItem';
import { Book } from '../models/Book';
import { sequelize } from '../database/postgres';
import { Address } from '../models/Address';
import { User } from '../models/User';


export default class OrderController {
  static async checkout(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { addressId, cartId, paymentMode } = req.body;
    const userId = req.user?.id?.toString();
    if (!userId) return res.status(400).json({ message: 'User identifier not found' });

    const t = await sequelize.transaction();
    try {
      const cart = await Cart.findOne({
        where: { id: cartId, user: userId },
        include: [{ model: CartItem, as: 'items', include: [{ model: Book, as: 'book' }] }],
        transaction: t,
      });
      if (!cart) {
        await t.rollback();
        return res.status(404).json({ message: 'Cart not found' });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cartItems = cart.getItems() as unknown as any[];
      if (!cartItems || cartItems?.length === 0) {
        await t.rollback();
        return res.status(400).json({ message: 'Cart is empty' });
      }

      let orderTotal = 0;
      const orderItemsData = [];
      for (const item of cartItems) {
        const book = item.getDataValue('book');
        if (!book) continue;
        if (item.quantity > book.sellableQuantity) {
          await t.rollback();
          return res.status(400).json({
            message: `Insufficient stock for book ${book.name}`,
            bookId: book.id,
            available: book.sellableQuantity,
            requested: item.quantity,
          });
        }
        const unitPrice = parseFloat(book.price.toString());
        const totalCost = unitPrice * item.quantity;
        orderTotal += totalCost;
        orderItemsData.push({
          bookId: book.id,
          quantity: item.quantity,
          unitPrice,
          totalCost,
        });
      }

      const order = await Order.create({
        user: userId,
        addressId,
        paymentMode,
        total: orderTotal,
        status: 'placed',
      }, { transaction: t });

      for (const itemData of orderItemsData) {
        await OrderItem.create({
          orderId: order.id,
          ...itemData,
        }, { transaction: t });
        const book = await Book.findByPk(itemData.bookId, { transaction: t });
        if (book) {
          await book.update({
            sellableQuantity: book.sellableQuantity - itemData.quantity,
          }, { transaction: t });
        }
      }

      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });
      await cart.destroy({ transaction: t });

      await t.commit();
      return res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
    } catch (error) {
      await t.rollback();
      console.error('Checkout error:', error);
      throw error;
    }
  }

  static async getMyOrders(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id?.toString();
    if (!userId) return res.status(400).json({ message: 'User identifier not found' });
    try {
      const orders = await Order.findAll({
        where: { user: userId },
        include: [{ model: OrderItem, as: 'items', include: [{ model: Book, as: 'book' }] }, { model: Address, as: 'address' }],
        order: [['created_at', 'DESC']],
      });
      const ordersData = orders.map(order => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orderJson = order.toJSON() as any;
        return {
          id: orderJson.id,
          addressId: orderJson.addressId,
          total: orderJson.total,
          status: orderJson.status,
          createdAt: orderJson.created_at,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: orderJson.items.map((item:any) => ({
            id: item.id,
            bookId: item.bookId,
            name: item.book.name,
            price: item.unitPrice,
            quantity: item.quantity,
            totalCost: item.totalCost,
          })),
        };
      });
      return res.status(200).json(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  static async getAllOrders(req: Request, res: Response): Promise<Response> {
    try {
      const orders = await Order.findAll({
        include: [
          { model: OrderItem, as: 'items', include: [{ model: Book, as: 'book' }] },
          { model: Address, as: 'address' },
          { model: User, as: 'user' },
        ],
        order: [['created_at', 'DESC']],
      });
      const ordersData = orders.map(order => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orderJson = order.toJSON() as any;
        return orderJson;
      });
      return res.status(200).json({data: ordersData});
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }
}
