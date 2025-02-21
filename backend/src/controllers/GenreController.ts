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
            return res.status(200).json(genre);
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
            
            if (!page || !limit) {
                const genres = await Genre.findAll();
                return res.status(200).json(genres);
            }
            const genres = await Genre.findAll({
                limit: parseInt(limit, 10),
                offset: parseInt(page, 10) * parseInt(limit, 10)
            });
            return res.status(200).json(genres);
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
            //         const associatedBooksCount = await Book.count({ where: { genreId: id } });
            // if (associatedBooksCount > 0) {
            //   return res.status(400).json({
            //     message: 'Cannot delete genre: it is associated with one or more books.'
            //   });
            // }
            const genre = await Genre.destroy({ where: { id } });
            return res.status(200).json(genre);
        } catch (error) {
            console.error('Error while deleting genre:', error);
            throw error;
        }
    }
    // static async transferGenre(req: Request, res: Response): Promise<Response> {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(400).json({ errors: errors.array() });
    //     }
    //     const { sourceId, destinationId } = req.body;
    //     try {
    //         // await Book.update({ genreId: destinationId }, { where: { genreId: sourceId } });
    //         // return res.status(200).json({ message: 'Genre transfer successful' });
    //     } catch (error) {
    //         console.error('Error while transferring genre:', error);
    //         throw error;
    //     }
    // }
}