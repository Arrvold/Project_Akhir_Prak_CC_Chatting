import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./usermodel.js"; // <-- 1. Impor User Model

const { DataTypes } = Sequelize;

const Chat = db.define("Chat", {
    id_chat: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {        
            model: User,       
            key: 'id_user'     
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'   
    },
    id_receiver: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {         
            model: User,    
            key: 'id_user'    
        },
        onDelete: 'CASCADE',  
        onUpdate: 'CASCADE'   
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW 
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default Chat;