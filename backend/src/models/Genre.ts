import { Model, DataTypes, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

interface GenreAttributes {
    id: number;
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
  
}

type GenreCreationAttributes = Optional<GenreAttributes, 'id' | 'createdAt' | 'updatedAt'>

export class Genre extends Model<GenreAttributes, GenreCreationAttributes>
  implements GenreAttributes {
  public id!: number;
  public name!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


export function initGenreModel(sequelize: Sequelize): typeof Genre {
    Genre.init(
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
        tableName: 'genres',
        timestamps: true, 
        indexes: [
          {
            name: 'genres_name_unique_index',
            unique: true,
            fields: ['name'],
          },
        ],
      }
    );
    return Genre;
  }