import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
import Medicamento from "./medicamentos.js";

const DetallePedido = sequelize.define('DetallePedido', {
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MEDICAMENTO_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Medicamento,
            key: 'id'
        }
    },
}, {
    tableName: 'DETALLE_PEDIDO',
    timestamps: false
});

DetallePedido.belongsTo(Medicamento, { foreignKey: 'MEDICAMENTO_id' });

export default DetallePedido;
