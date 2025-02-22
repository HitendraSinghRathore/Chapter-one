import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface  AuthorAttribtes {
    id: number;
    name: string;
    about: string;
    dob: Date;
    image: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

type AuthorCreationAttributes = Optional<AuthorAttribtes, 'id' | 'createdAt' | 'updatedAt' | 'image'>;

export class Author extends Model<AuthorAttribtes, AuthorCreationAttributes> implements AuthorAttribtes {
    public id!: number;
    public name!: string;
    public about!: string;
    public dob!: Date;
    public image!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export function initAuthorModel(sequelize: Sequelize): typeof Author {
    Author.init(
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
            about: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            dob: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            image: {
                type: DataTypes.TEXT,
                allowNull: true
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
            tableName: 'author',
            timestamps: true,
            indexes: [
                {
                    name: 'author_name_unique_index',
                    unique: true,
                    fields: ['name'],
                }
            ]
        }

    )
    return Author;
}