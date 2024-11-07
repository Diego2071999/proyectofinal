import sequelize from "../database/database.js";
import { DataTypes } from 'sequelize';
import Doctores from "./doctor.js";
import Clientes from "./cliente.js";

const Pacientes = sequelize.define('paciente', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre_encargado: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'paciente',
    timestamps: false
});

Pacientes.belongsTo(Doctores, { foreignKey: 'DOCTOR_id' });
Pacientes.belongsTo(Clientes, { foreignKey: 'CLIENTE_id' });

export default Pacientes;