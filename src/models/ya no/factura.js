import sequelize from "../database/database.js";
import { DataTypes } from 'sequelize';
import Clientes from "./cliente.js";
import Pacientes from "./paciente.js";
import TiposEnfermedad from "./tipoEnfermedad.js";
import Doctores from "./doctor.js";
import Recetas from "./receta.js";

const Facturas = sequelize.define('factura', {
    cod_factura: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'factura',
    timestamps: false
});

Facturas.belongsTo(Clientes, { foreignKey: 'CLIENTE_id' });
Facturas.belongsTo(Pacientes, { foreignKey: 'PACIENTE_id' });
Facturas.belongsTo(TiposEnfermedad, { foreignKey: 'TIPO_ENFERMEDAD_id' });
Facturas.belongsTo(Doctores, { foreignKey: 'DOCTOR_id' });
Facturas.belongsTo(Recetas, { foreignKey: 'RECETA_id' });

export default Facturas;