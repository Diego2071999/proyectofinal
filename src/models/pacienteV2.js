import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
import Factura from "./factura.js";

const Paciente = sequelize.define('Paciente', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    referencia: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    edad:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre_encargado:{
        type: DataTypes.STRING,
        allowNull: false
    },
    FACTURA_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Factura,
            key: 'id'
        }
    }
}, {
    tableName: 'PACIENTE',
    timestamps: false
});

// Establece la relación de Pedido con Factura
Paciente.belongsTo(Factura, { foreignKey: 'FACTURA_id' });
Factura.hasMany(Paciente, { foreignKey: 'FACTURA_id' });

export default Paciente;