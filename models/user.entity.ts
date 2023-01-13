import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeDb as sequelize } from '../db';

interface IUser {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    role_id: number;
    createdAt: Date;
    updatedAt: Date;
}

export type UserCreationAttributes = Optional<IUser, 'id'>

export class User extends Model<IUser, UserCreationAttributes>{
    declare id: number;
    declare name: string;
    declare username: string;
    declare email: string;
    declare password: string;
    declare role_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;
}

User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(40),
        allowNull: false,
      },
      username: {
        type: new DataTypes.STRING(40),
        allowNull: false,
      },
      email: {
        type: new DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: new DataTypes.STRING(255),
        allowNull: false,
      },
      role_id: {
        type: new DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'roles',
                key: 'id'
        }
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'user',
    }
  )