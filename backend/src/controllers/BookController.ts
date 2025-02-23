import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Book } from '../models/Book';
import { Genre } from '../models/Genre';
import { Author } from '../models/Author';
import { GridFSFile } from '../types/interface.types';

export default class BookController {
  static async createBook(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {
      name,
      description,
      ISBN,
      pageCount,
      sellableQuantity,
      price,
      countryOfOrigin,
      publishedDate,
      edition,
      authorId,
      genres, 
    } = req.body;
    const imageRef = req.file ? (req.file as unknown as GridFSFile).id.toString() : null;
    try {
      const book = await Book.create({
        name,
        description,
        ISBN,
        pageCount,
        sellableQuantity,
        price,
        countryOfOrigin,
        publishedDate: new Date(publishedDate),
        edition,
        image: imageRef,
        authorId,
      });
      if (genres) {
        if(typeof genres === 'string') { 
          const genresData= JSON.parse(genres);
          await book.setGenres(genresData);
        }
         if (Array.isArray(genres)) {
  
        await book.setGenres(genres);
    }
       
      }
      return res.status(201).json(book);
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  }

  static async updateBook(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const {
      name,
      description,
      ISBN,
      pageCount,
      sellableQuantity,
      price,
      countryOfOrigin,
      publishedDate,
      edition,
      authorId,
      genres,
    } = req.body;
    try {
      const book = await Book.findByPk(id);
      if (!book) return res.status(404).json({ message: 'Book not found' });
        
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (ISBN !== undefined) updateData.ISBN = ISBN;
      if (pageCount !== undefined) updateData.pageCount = pageCount;
      if (sellableQuantity !== undefined) updateData.sellableQuantity = sellableQuantity;
      if (price !== undefined) updateData.price = price;
      if (countryOfOrigin !== undefined) updateData.countryOfOrigin = countryOfOrigin;
      if (publishedDate !== undefined) updateData.publishedDate = new Date(publishedDate);
      if (edition !== undefined) updateData.edition = edition;
      if (authorId !== undefined) updateData.authorId = authorId;
      if (req.file) updateData.image = (req.file as unknown as GridFSFile).id.toString();

      await book.update(updateData);
      if (genres && Array.isArray(genres)) {
        await book.setGenres(genres);
      }
      return res.status(200).json(book);
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }

  static async getBook(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const book = await Book.findByPk(id, {
        include: [
          { model: Genre, as: 'genres', through: { attributes: ['GenreId'] } },
          { model: Author, as: 'author' },
        ],
      });
      if (!book) return res.status(404).json({ message: 'Book not found' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bookData = book.toJSON() as any;
      bookData.image = `/api/images/${bookData.image}`;
      if(bookData.author) {
          bookData.author.image = `/api/images/${bookData.author.image}`;
      }
      bookData.outOfStock = bookData.sellableQuantity === 0;
      delete bookData.sellableQuantity;
      
      return res.status(200).json({
        data: book
      });
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }

  static async getBooks(req: Request, res: Response): Promise<Response> {
    try {
      const {
        page,
        limit,
        name,       
        minPrice,
        maxPrice,
        authorId,
        genreIds,   
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const includeClause: any = [
        { model: Genre, as: 'genres', through: { attributes: [] } },
        { model: Author, as: 'author' },
      ];
      if (genreIds) {
        const genreArray = (genreIds as string).split(',').map(id => parseInt(id, 10));
        includeClause[0].where = { id: { [Op.in]: genreArray } };
      }

      const { count, rows: books } = await Book.findAndCountAll({
        where: whereClause,
        include: includeClause,
        limit: limitNum,
        offset: pageNum * limitNum,
      });
      const booksData = books.map((book) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bookJson = book.toJSON() as any;

        delete bookJson.genres;
        delete bookJson.description;
        delete bookJson.publishedDate;
        delete bookJson.edition;
        delete bookJson.ISBN;
        delete bookJson.pageCount;
        delete bookJson.sellableQuantity;

        if (bookJson.image) {
          bookJson.image = `/api/images/${bookJson.image}`;
        }
        if(bookJson.author) {
            bookJson.author.image = `/api/images/${bookJson.author.image}`;
        }
        bookJson.outOfStock = bookJson.sellableQuantity === 0;
        return bookJson;
      });
      return res.status(200).json({
        data: booksData,
        total: count,
        page: page,
        limit: limit,
        pages: Math.ceil(count / limitNum),
        hasNextPage: pageNum < Math.ceil(count / limitNum),
        hasPreviousPage: pageNum > 0

      });
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }
}
