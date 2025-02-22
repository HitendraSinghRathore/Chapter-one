import { validationResult } from 'express-validator';
import { Author } from '../models/Author';
import { Request, Response } from 'express';
import { GridFSFile } from '../types/interface.types';

export default class AuthorController {
    static async getAuthor(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        try {
          const author = await Author.findByPk(id);
          if (!author) {
            return res.status(404).json({ message: 'Author not found' });
          }
          const authorData = author.toJSON();
          if (authorData.image) {
            authorData.image = `/api/images/${authorData.image}`;
          }
          return res.status(200).json({
            data: authorData,
          });
        } catch (error) {
          console.error('Error while fetching author:', error);
          throw error;
        }
      }
      static async getAuthors(req: Request, res: Response): Promise<Response> {
        try {
            const { page, limit } = req.query as { page: string; limit: string };
            if (!page && !limit) {
              const authors = await Author.findAll({order: [['updatedAt', 'DESC']]});
              const authorsData = authors.map((author) => {
                const authorJson = author.toJSON();
                if (authorJson.image) {
                    authorJson.image = `/api/images/${author.image}`;
                }
                return authorJson;
              });
              return res.status(200).json({
                data: authorsData,
              });
            }
            const { count, rows: authors} = await Author.findAndCountAll({
              limit: parseInt(limit, 10),
              offset: parseInt(page, 10) * parseInt(limit, 10),
              order: [['updatedAt', 'DESC']]
            });
            const authorsData = authors.map((author) => {
              const authorJson = author.toJSON();
              if (authorJson.image) {
                authorJson.image = `/api/images/${author.image}`;
              }
              return authorJson;
            });
            return res.status(200).json({
                data: authorsData,
                total: count,
                page: page,
                limit: limit,
                pages: Math.ceil(count / parseInt(limit, 10)),
                hasNextPage: parseInt(page, 10) < Math.ceil(count / parseInt(limit, 10)),
                hasPreviousPage: parseInt(page, 10) > 0
            });
        }catch (error) {
          console.error('Error while fetching authors:', error);
          throw error;
        }
      }

      static async createAuthor(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, about, dob } = req.body;
        try {
            const image = req.file ? (req.file as unknown as GridFSFile).id.toString() : null;
            const author = await Author.create({ name, about, dob: new Date(dob), image });
            const authorData = author.toJSON();
            if (authorData.image) {
              authorData.image = `/api/images/${authorData.image}`;
            }
            return res.status(201).json(authorData);
        } catch(error) {
            console.error('Error while creating author:', error);
            throw error;
        }
    }
    static async updateAuthor(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { id } = req.params;
            const updateData = req.body;
            if(req.file && req.file.filename) {
                updateData.image = (req.file as unknown as GridFSFile).id.toString();

            }
            const [updatedCount, updatedAuthor] = await Author.update(updateData, { where: { id } ,returning: true});
            if (updatedCount === 0) {
                return res.status(404).json({ message: 'Author not found' });
            }
            const authorData = updatedAuthor[0].toJSON();
            if (authorData.image) {
              authorData.image = `/api/images/${authorData.image}`;
            }
            return res.status(200).json(authorData);

        }catch(error) {
            console.error('Error while updating author:', error);
            throw error;
        }
    }
}