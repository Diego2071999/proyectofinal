import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
import DetallePedido from "./detallepedido.js";
import Receta from "./recetaV2.js";
import Factura from "./factura.js";

const Pedido = sequelize.define('Pedido', {
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    DETALLE_PEDIDO_id: {
        type: DataTypes.INTEGER,
        references: {
            model: DetallePedido,
            key: 'id'
        }
    },
    RECETA_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Receta,
            key: 'id'
        }
    },
    FACTURA_id: { // Nueva columna añadida
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Factura,
            key: 'id'
        }
    }
}, {
    tableName: 'PEDIDO',
    timestamps: false
});

// Definir asociaciones
Pedido.belongsTo(DetallePedido, { foreignKey: 'DETALLE_PEDIDO_id', as: 'detallePedido' });
Pedido.belongsTo(Receta, { foreignKey: 'RECETA_id', as: 'recetas' });
Pedido.belongsTo(Factura, { foreignKey: 'FACTURA_id', as: 'factura' }); // Nueva asociación

export default Pedido;
