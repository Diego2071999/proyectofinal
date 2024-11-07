import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";

const Doctor = sequelize.define('Doctor', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    instituto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sede: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'DOCTOR',
    timestamps: false
});

export default Doctor;
