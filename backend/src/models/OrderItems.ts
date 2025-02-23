import { Model, DataTypes, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface OrderItemAttributes {
  id: number;
  orderId: number;
  bookId: number;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderItemCreationAttributes = Optional<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: number;
  public orderId!: number;
  public bookId!: number;
  public quantity!: number;
  public unitPrice!: number;
  public totalCost!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initOrderItemModel(sequelize: Sequelize): typeof OrderItem {
  OrderItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
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
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      totalCost: {
        type: DataTypes.DECIMAL(10, 2),
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
      tableName: 'order_items',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return OrderItem;
}
