import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";

const Factura = sequelize.define('Factura', {
    nit: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nomfac: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'FACTURA',
    timestamps: false
});

export default Factura;
