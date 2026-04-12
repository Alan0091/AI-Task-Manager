import { DataTypes, Sequelize } from "sequelize";
import { postgresConnect } from "../Config/db.js";

const Task = postgresConnect.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ai_steps: {
        type: DataTypes.JSON,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending'
    }
})

export default Task;