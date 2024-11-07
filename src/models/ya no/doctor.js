import sequelize from "../database/database.js";
import { DataTypes } from 'sequelize';

const Doctores = sequelize.define('doctor', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    institucion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    sede: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'doctor',
    timestamps: false
});

export default Doctores;