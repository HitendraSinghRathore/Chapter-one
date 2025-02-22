import { Model, DataTypes, Optional } from 'sequelize';
import type { BelongsToManyAddAssociationMixin, BelongsToManyCountAssociationsMixin, BelongsToManyGetAssociationsMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, Sequelize } from 'sequelize';
import { Genre } from './Genre';

export interface BookAttributes {
  id: number;
  name: string;
  description: string;
  ISBN: string;
  pageCount: number;
  sellableQuantity: number;
  price: number;
  countryOfOrigin: string;
  publishedDate: Date;
  edition: string;
  image: string | null;  
  authorId: number;     
  createdAt?: Date;
  updatedAt?: Date;

  
}

export type BookCreationAttributes = Optional<BookAttributes, 'id' | 'image' | 'createdAt' | 'updatedAt'>;

export class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public ISBN!: string;
  public pageCount!: number;
  public sellableQuantity!: number;
  public price!: number;
  public countryOfOrigin!: string;
  public publishedDate!: Date;
  public edition!: string;
  public image!: string | null;
  public authorId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public setGenres!: BelongsToManySetAssociationsMixin<Genre, number>;
  public getGenres!: BelongsToManyGetAssociationsMixin<Genre>;
  public removeGenre!: BelongsToManyRemoveAssociationsMixin<Genre, number>;
  public getGenresCount!: BelongsToManyCountAssociationsMixin;
  public addGenre!: BelongsToManyAddAssociationMixin<Genre, number>;
}

export function initBookModel(sequelize: Sequelize): typeof Book {
  Book.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ISBN: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      pageCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sellableQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      countryOfOrigin: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      publishedDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      edition: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
      },
    },
    {
      sequelize,
      tableName: 'books',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { name: 'books_name_index', fields: ['name'] },
        { name: 'books_price_index', fields: ['price'] },
        { name: 'books_author_index', fields: ['authorId'] },
      ],
    }
  );
  return Book;
}
