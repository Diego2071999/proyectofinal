import sequelize from "../database/database.js";
import {DataTypes} from 'sequelize'
import Roles from "./roles.js";


const Usuarios = sequelize.define('usuario',
    {
        Nombre:{
            type: DataTypes.STRING,
        },
        lastname:{
            type: DataTypes.STRING,
        },
        Correo:{
            type: DataTypes.STRING,
        },
        telefono:{
            type: DataTypes.STRING,
        },
        idrol:{
            type: DataTypes.INTEGER,
            primaryKey: true, // Definir idrol como clave primaria
        references: {
            model: Roles, // Establecer la relación con la tabla de Roles
            key: 'id' // Clave primaria de la tabla de Roles
        }
        },
        password:{
            type: DataTypes.STRING,
            
        },
        nombre_usuario:{
            type: DataTypes.STRING
        }
    }, {
        tableName: 'usuario',
        timestamps: false // Desactivar timestamps automáticos
});

Usuarios.belongsTo(Roles, {foreignKey: 'idrol'});

export  default Usuarios;
