import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./usermodel.js"; 

const { DataTypes } = Sequelize;

const Contact = db.define("Contact", {
    id_contact: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_useradder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {       
            model: User,     
            key: 'id_user'     
        },
        onDelete: 'CASCADE',   
        onUpdate: 'CASCADE'    
    },
    id_userreceiver: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {       
            model: User,       
            key: 'id_user'     
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE' 
    },
    nickname: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default Contact;