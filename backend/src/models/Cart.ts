import { Model, DataTypes, Optional } from 'sequelize';
import type { HasManyGetAssociationsMixin, Sequelize } from 'sequelize';
import { CartItem } from './CartItem';

export interface CartAttributes {
  id: number;
  user: string; 
  createdAt?: Date;
  updatedAt?: Date;
}

export type CartCreationAttributes = Optional<CartAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Cart extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes {
  public id!: number;
  public user!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public getItems!: HasManyGetAssociationsMixin<CartItem>;
}

export function initCartModel(sequelize: Sequelize): typeof Cart {
  Cart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user: {
        type: DataTypes.STRING(255),
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
      tableName: 'carts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Cart;
}
