import sequelize from "../database/database.js";
import { DataTypes } from 'sequelize';

const Clientes = sequelize.define('cliente', {
    NIT: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true
    },
    nombre_en_factura: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion_de_entrega: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    referencia: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    telefono2: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    codclie: {
        type: DataTypes.STRING, // Cambiar a STRING para permitir formato alfanumérico
        allowNull: true
    }
}, {
    tableName: 'cliente',
    timestamps: false
});

export default  Clientes