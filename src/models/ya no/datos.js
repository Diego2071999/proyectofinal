import sequelize from "../database/database.js";
import { DataTypes } from 'sequelize';
import Clientes from "./cliente.js";
import Facturas from "./factura.js";
import Fechas from "./fecha.js";

const Datos = sequelize.define('datos', {}, {
    tableName: 'datos',
    timestamps: false
});

Datos.belongsTo(Clientes, { foreignKey: 'CLIENTE_id' });
Datos.belongsTo(Facturas, { foreignKey: 'Factura_id' });
Datos.belongsTo(Fechas, { foreignKey: 'FECHA_id' });

export default Datos;