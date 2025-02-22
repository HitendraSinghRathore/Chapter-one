import { Model, DataTypes, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface AddressAttributes {
  id: number;
  contactName: string;    
  address: string;        
  latitude: number;      
  longitude: number;     
  primary: boolean;
  houseNo: string;        
  area: string;           
  landmark?: string;     
  contactNumber?: string;
  instructions?: string;  
  user: string;           
  createdAt?: Date;
  updatedAt?: Date;
}

export type AddressCreationAttributes = Optional<
  AddressAttributes,
  'id' | 'landmark' | 'contactNumber' | 'instructions' | 'createdAt' | 'updatedAt'
>;

export class Address extends Model<AddressAttributes, AddressCreationAttributes>
  implements AddressAttributes {
  public id!: number;
  public contactName!: string;
  public address!: string;
  public primary!: boolean;
  public latitude!: number;
  public longitude!: number;
  public houseNo!: string;
  public area!: string;
  public landmark?: string;
  public contactNumber?: string;
  public instructions?: string;
  public user!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initAddressModel(sequelize: Sequelize): typeof Address {
  Address.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      primary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      contactName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
      houseNo: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      area: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      landmark: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contactNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      instructions: {
        type: DataTypes.STRING(1024),
        allowNull: true,
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
      tableName: 'addresses',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          name: 'addresses_user_index',
          fields: ['user'],
        },
      ],
    }
  );
  return Address;
}
