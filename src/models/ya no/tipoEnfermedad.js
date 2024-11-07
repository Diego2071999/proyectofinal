import sequelize from "../database/database.js";
import { DataTypes } from 'sequelize';
import Pacientes from "./paciente.js";

const TiposEnfermedad = sequelize.define('tipo_enfermedad', {
    cronica: {
        type: DataTypes.STRING,
        allowNull: true
    },
    aguda: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'tipo_enfermedad',
    timestamps: false
});

// Relación con Pacientes
TiposEnfermedad.belongsTo(Pacientes, { foreignKey: 'PACIENTE_id' });

export default TiposEnfermedad;