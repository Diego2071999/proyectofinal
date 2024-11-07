import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
import DetalleReceta from "./detalleReceta.js";
import Paciente from "./pacienteV2.js";
import Medicamento from "./medicamentos.js"; // Este modelo debe estar definido en otra parte
import Doctor from "./doctorV2.js"; // Nuevo modelo importado para la relación

const Receta = sequelize.define('Receta', {
    DETALLE_RECETA_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DetalleReceta,
            key: 'id'
        }
    },
    MEDICAMENTO_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Medicamento,
            key: 'id'
        }
    },
    PACIENTE_cod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Paciente,
            key: 'id'
        }
    },
    DOCTOR_id: { // Nueva columna añadida
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Doctor,
            key: 'id'
        }
    }
}, {
    tableName: 'RECETA',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['DETALLE_RECETA_id', 'MEDICAMENTO_id', 'PACIENTE_cod', 'DOCTOR_id'],
            name: 'unique_receta_constraint'
        }
    ]
});

// Definir asociaciones
Receta.belongsTo(DetalleReceta, { foreignKey: 'DETALLE_RECETA_id', as: 'detalleReceta' });
Receta.belongsTo(Medicamento, { foreignKey: 'MEDICAMENTO_id', as: 'medicamento' });
Receta.belongsTo(Paciente, { foreignKey: 'PACIENTE_cod', as: 'paciente' });
Receta.belongsTo(Doctor, { foreignKey: 'DOCTOR_id', as: 'doctor' }); // Nueva asociación

export default Receta;
