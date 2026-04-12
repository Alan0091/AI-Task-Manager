import { Sequelize } from "sequelize";
import dotenv from 'dotenv'

dotenv.config();

const postgresConnect = new Sequelize(process.env.DB_KEY, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
})

const connectDb = async() => {

    try {
        await postgresConnect.authenticate();
        console.log("Postgres Database connected 🚀");
        
    } catch (error) {
        console.error("Error", error.message)
    }
}

export { postgresConnect, connectDb};