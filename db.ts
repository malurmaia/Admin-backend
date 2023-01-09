import { Sequelize } from 'sequelize';
import mongoose, { Mongoose } from 'mongoose';
require('dotenv').config()
 
const {
     SQL_DB_USER,
    SQL_DB_PASS,
    SQL_DB_HOST, 
    SQL_DB_PORT, 
    SQL_DB_NAME, 
    NOSQL_DB_USER,
    NOSQL_DB_PASS,
    NOSQL_DB_HOST,
    NOSQL_BD_PORT,
    NOSLQ_DB_NAME 
    } = process.env;

mongoose.connect(`mongodb+srv://${NOSQL_DB_USER}:${NOSQL_DB_PASS}@${NOSQL_DB_HOST}/${NOSQL_BD_PORT}adminjsMongo?retryWrites=true&w=majority`)

const mongooseDb = mongoose.connection;

const sequelizeDb = new Sequelize(`mysql://${SQL_DB_USER}:$${SQL_DB_PASS}@$${SQL_DB_HOST}:${SQL_DB_PORT}/${SQL_DB_NAME}`, {
    dialect:'mysql'
});
export {
    sequelizeDb,
    mongoose
}