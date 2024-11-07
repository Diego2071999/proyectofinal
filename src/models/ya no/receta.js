import sequelize from "../database/database.js";
import { DataTypes } from 'sequelize';
import Doctores from "./doctor.js";
import Medicamentos from "./medicamentos.js";

const Recetas = sequelize.define('receta', {
    dosis_diaria: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad_diaria: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tiempo: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'receta',
    timestamps: false
});

Recetas.belongsTo(Doctores, { foreignKey: 'DOCTOR_id' });
Recetas.belongsTo(Medicamentos, { foreignKey: 'MEDICAMENTO_id' });

export default Recetas;