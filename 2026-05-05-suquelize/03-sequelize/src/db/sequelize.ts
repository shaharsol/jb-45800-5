import { Sequelize } from "sequelize-typescript";
import User from "../models/User";
import config from 'config'

const sequelize = new Sequelize({
    dialect: 'mysql',
    models: [User],
    logging: console.log,
    ...config.get('db')
})

export default sequelize