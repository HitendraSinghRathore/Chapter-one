import { Model, DataTypes, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

interface UserAttributes {
    id: number;
    email: string;
    passwordHash: string;
    mobile: string;
    role: 'admin' | 'regular';
    createdAt?: Date;
    updatedAt?: Date;
  }

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>


export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public mobile!: string;
  public role!: 'admin' | 'regular';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


export function initUserModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true, 
        },
        mobile: {
          type: DataTypes.STRING(15),
          allowNull: false,
        },
        passwordHash: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('admin', 'regular'),
          allowNull: false,
          defaultValue: 'regular',
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
        tableName: 'users',
        timestamps: false, 
        indexes: [
          {
            name: 'users_email_unique_index',
            unique: true,
            fields: ['email'],
          },
          {
            name: 'users_role_index',
            fields: ['role'],
          },
        ],
      }
    );
    return User;
  }