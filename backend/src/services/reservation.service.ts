import { Transaction } from 'sequelize';
import { Book } from '../models/Book';


export async function checkAvailability(bookId: number, requiredQuantity: number, transaction?: Transaction): Promise<boolean> {
  const book = await Book.findByPk(bookId, { transaction });
  if (!book) throw new Error('Book not found');
  return book.sellableQuantity >= requiredQuantity;
}
