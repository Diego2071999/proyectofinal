import sequelize from "../database/database.js";
import {DataTypes} from 'sequelize'

const Roles = sequelize.define('rol',  // nombre del modelo
{
        Rol: {
            type: DataTypes.STRING,
        },
    }, {
        tableName: 'rol',
        timestamps: false // Desactivar timestamps automáticos
});

export  default Roles;
