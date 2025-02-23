import { Model, DataTypes, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface CartItemAttributes {
  id: number;
  cartId: number;
  bookId: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CartItemCreationAttributes = Optional<CartItemAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes {
  public id!: number;
  public cartId!: number;
  public bookId!: number;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initCartItemModel(sequelize: Sequelize): typeof CartItem {
  CartItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
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
      tableName: 'cart_items',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return CartItem;
}