import sequelize from "../database/database.js";
import { DataTypes } from 'sequelize';

const Fechas = sequelize.define('fecha', {
    entrega: {
        type: DataTypes.DATE,
        allowNull: false
    },
    factura: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'fecha',
    timestamps: false
});

export default Fechas;