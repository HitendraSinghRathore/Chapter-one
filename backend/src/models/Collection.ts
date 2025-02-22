import { Model, DataTypes, Optional } from 'sequelize';
import type { BelongsToManyCountAssociationsMixin, BelongsToManyGetAssociationsMixin, BelongsToManySetAssociationsMixin, Sequelize } from 'sequelize';
import { Book } from './Book';

export interface CollectionAttributes {
  id: number;
  name: string;
  description?: string;
  image?: string | null; 
  createdAt?: Date;
  updatedAt?: Date;
}

export type CollectionCreationAttributes = Optional<CollectionAttributes, 'id' | 'description' | 'image' | 'createdAt' | 'updatedAt'>;

export class Collection extends Model<CollectionAttributes, CollectionCreationAttributes>
  implements CollectionAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public image?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getBooks!: BelongsToManyGetAssociationsMixin<Book>;
  public setBooks!: BelongsToManySetAssociationsMixin<Book, number>;
  public countBooks!: BelongsToManyCountAssociationsMixin;
}

export function initCollectionModel(sequelize: Sequelize): typeof Collection {
  Collection.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'collections',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          name: 'collections_name_index',
          fields: ['name'],
        },
      ],
    }
  );
  return Collection;
}
