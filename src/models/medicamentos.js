import sequelize from "../database/database.js";
import {DataTypes} from 'sequelize';

const medicamento = sequelize.define('medicamento',
    {
        codigo: {
            type: DataTypes.STRING,
        },
        nombre: {
            type: DataTypes.STRING,
        },
        contenido: {
            type: DataTypes.STRING,
        },
        presentacion: {
            type: DataTypes.STRING,
        },
        descripcion: {
            type: DataTypes.STRING,
        }

    }, {
        freezeTableName: true, // Esto asegura que Sequelize no pluralice el nombre de la tabla
        timestamps: false // Desactivar timestamps automáticos
        }
);

export  default medicamento;