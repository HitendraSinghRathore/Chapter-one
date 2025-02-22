import { validationResult } from 'express-validator';
import { Genre } from '../models/Genre';
import { Request, Response } from 'express';

export default class GenreController {
    static async getGenre(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = parseInt(req.params.id, 10);
        try {
            const genre = await Genre.findByPk(id);
            if (!genre) {
                return res.status(404).json({ message: 'Genre not found' });
            }
            return res.status(200).json({
                data: genre,
            });
        } catch (error) {
            console.error('Error while fetching genre:', error);
            throw error;
        }
    }
    static async getGenres(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {

            const { page, limit } = req.query as { page: string; limit: string };
            
            if (!page && !limit) {
                const genres = await Genre.findAll({order: [['updatedAt', 'DESC']]});
                return res.status(200).json({
                    data: genres,
                });
            }
            const {count, rows: genres} = await Genre.findAndCountAll({
                limit: parseInt(limit, 10),
                offset: parseInt(page, 10) * parseInt(limit, 10),
                order: [['updatedAt', 'DESC']]
            });
            return res.status(200).json({
                data: genres,
                total: count,
                page: page,
                limit: limit,
                pages: Math.ceil(count / parseInt(limit, 10)),
                hasNextPage: parseInt(page, 10) < Math.ceil(count / parseInt(limit, 10)),
                hasPreviousPage: parseInt(page, 10) > 0
            });
        } catch (error) {
            console.error('Error while fetching genres:', error);
            throw error;
        }
    }
    static async createGenre(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, description } = req.body;
        try {
            const genre = await Genre.create({ name, description });
            return res.status(201).json(genre);
        } catch (error) {
            console.error('Error while creating genre:', error);
            throw error;
        }
    }
    static async updateGenre(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = parseInt(req.params.id, 10);
        const { name, description } = req.body;
        try {
            const genre = await Genre.update({ name, description }, { where: { id } });
            return res.status(200).json(genre);
        } catch (error) {
            console.error('Error while updating genre:', error);
            throw error;
        }
    }
    static async deleteGenres(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = parseInt(req.params.id, 10);
        try {
            const sourceGenre = await Genre.findByPk(id);
            if (!sourceGenre) {
                return res.status(404).json({ message: 'Genre not found' });
            }
            const associatedBooksCount = await sourceGenre.getBooksCount();
            if (associatedBooksCount > 0) {
              return res.status(400).json({
                message: 'Cannot delete genre: it is associated with one or more books.'
              });
            }
            const genre = await Genre.destroy({ where: { id } });
            return res.status(200).json(genre);
        } catch (error) {
            console.error('Error while deleting genre:', error);
            throw error;
        }
    }
    static async transferGenre(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { sourceId, destinationId } = req.body;
        try {
          const sourceGenre = await Genre.findByPk(sourceId);
          const destinationGenre = await Genre.findByPk(destinationId);
          if (!sourceGenre || !destinationGenre) {
            return res.status(400).json({ message: 'Please add valid genres' });
          }
          const books = await sourceGenre.getBooks();
          for (const book of books) {
            await book.removeGenre([sourceGenre]);
            const associatedGenres = await book.getGenres();
            const alreadyAssociated = associatedGenres.some((g) => g.id === destinationGenre.id);
            if (!alreadyAssociated) {
              await book.addGenre(destinationGenre);
            }
          }
          return res.status(200).json({ message: 'Genre transfer successful' });
        } catch (error) {
          console.error('Error while transferring genre:', error);
          throw error;
        }
      }
}