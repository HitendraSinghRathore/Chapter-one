import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Collection } from '../models/Collection';
import { GridFSFile } from '../types/interface.types';
import { Op } from 'sequelize';

export default class CollectionController {
  static async createCollection(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, description, books } = req.body;
    const imageRef = req.file ? (req.file as unknown as GridFSFile).id.toString() : null;
    try {
      const collection = await Collection.create({
        name,
        description,
        image: imageRef,
      });
      if (books && Array.isArray(books) && books.length > 0) {
        await collection.setBooks(books);
      }
      return res.status(201).json({data: collection});
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  }

  static async updateCollection(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { name, description, books } = req.body;
    try {
      const collection = await Collection.findByPk(id);
      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (req.file) {
        updateData.image = (req.file as unknown as GridFSFile).id.toString();
      }
      await collection.update(updateData);
      if (books && Array.isArray(books)) {
        await collection.setBooks(books);
      }
      return res.status(200).json({data:collection});
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  }

  static async deleteCollection(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { id } = req.params;
    try {
      const collection = await Collection.findByPk(id);
      if (!collection) return res.status(404).json({ message: 'Collection not found' });
      await collection.destroy();
      return res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  }

  static async getCollections(req: Request, res: Response): Promise<Response> {
    try {
      const collections = await Collection.findAll();
      const collectionsWithCount = await Promise.all(
        collections.map(async (collection) => {
          const count = await collection.countBooks();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const colJson = collection.toJSON() as any;
          colJson.bookCount = count;
          return {
            id: colJson.id,
            name: colJson.name,
            description: colJson.description,
            image: colJson.image ? `/api/images/${colJson.image}` : null,
            bookCount: count,
          };
        })
      );
      return res.status(200).json({data: collectionsWithCount});
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  }

  static async getCollectionById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const {
      page,
      limit,
      name,
      minPrice,
      maxPrice,
      authorId,
    } = req.query;
    const pageNum = page ? parseInt(page as string, 10) : 0;
    const limitNum = limit ? parseInt(limit as string, 10) : 10;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};
    if (name) {
      whereClause.name = { [Op.iLike]: `%${name}%` };
    }
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice as string);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice as string);
    }
    if (authorId) {
      whereClause.authorId = authorId;
    }
    try {
      const collection = await Collection.findByPk(id);
      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }
      const count = await collection.countBooks({
        where: whereClause,
      });
      const currentPage = pageNum - 1;
      const books = await collection.getBooks({
        where: whereClause,
        limit: limitNum,
        offset: currentPage * limitNum,
        include: [
          { association: 'genres', through: { attributes: [] } },
          { association: 'author' },
        ],
      });
      const booksData = books.map((book) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bookJson = book.toJSON() as any;
        if (bookJson.image) {
          bookJson.image = `/api/images/${bookJson.image}`;
        }
        if (bookJson.author && bookJson.author.image) {
          bookJson.author.image = `/api/images/${bookJson.author.image}`;
        }
        bookJson.outOfStock = bookJson.sellableQuantity === 0;
        return bookJson;
      });
      return res.status(200).json({
        collection: {
          id: collection.id,
          name: collection.name,
          description: collection.description,
          image: collection.image ? `/api/images/${collection.image}` : null,
        },
        data: booksData,
        totalBooks: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum),
        hasNextPage: pageNum < Math.ceil(count / limitNum) - 1,
        hasPreviousPage: pageNum > 0,
      });
    } catch (error) {
      console.error('Error fetching collection:', error);
      throw error;
    }
  }
}
