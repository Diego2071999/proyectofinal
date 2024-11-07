import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";

const DetalleReceta = sequelize.define('DetalleReceta', {
    dosis_diaria: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tiempo_consumo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'DETALLE_RECETA',
    timestamps: false
});

export default DetalleReceta;
