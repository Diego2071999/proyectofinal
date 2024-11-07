import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
import Paciente from "./pacienteV2.js";
import Doctor from "./doctorV2.js";

const DoctorPaciente = sequelize.define('DoctorPaciente', {
    PACIENTE_cod: {
        type: DataTypes.INTEGER,
        references: {
            model: Paciente,
            key: 'id'
        }
    },
    DOCTOR_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Doctor,
            key: 'id'
        }
    }
}, {
    tableName: 'DOCTORPACINTE',
    timestamps: false
});

DoctorPaciente.belongsTo(Paciente, { foreignKey: 'PACIENTE_cod' });
DoctorPaciente.belongsTo(Doctor, { foreignKey: 'DOCTOR_id' });

export default DoctorPaciente;
