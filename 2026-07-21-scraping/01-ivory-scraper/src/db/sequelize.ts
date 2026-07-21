import { Sequelize } from "sequelize-typescript";
import config from 'config'
import IvoryProduct from "../models/ivory-product";

const sequelize = new Sequelize({
    dialect: 'postgres',
    models: [IvoryProduct],
    logging: console.log,
    ...config.get('db')
})

export default sequelize