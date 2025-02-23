import { Model, DataTypes, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface OrderAttributes {
  id: number;
  user: string; 
  addressId: number;
  paymentMode: string;
  total: number;
  status: 'placed' | 'delivered';
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderCreationAttributes = Optional<OrderAttributes, 'id' | 'total' | 'status' | 'createdAt' | 'updatedAt'>;

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public user!: string;
  public addressId!: number;
  public paymentMode!: string;
  public total!: number;
  public status!: 'placed' | 'delivered';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initOrderModel(sequelize: Sequelize): typeof Order {
  Order.init(
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
      addressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paymentMode: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('placed', 'delivered'),
        allowNull: false,
        defaultValue: 'placed',
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
      tableName: 'orders',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Order;
}
