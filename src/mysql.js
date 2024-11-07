import { Sequelize } from "sequelize";

//const { Sequelize } = require("sequelize");

const database = process.env.DATABASE;
const username = process.env.USER;
const password = process.env.PASSWORD || "";
const host = process.env.HOST;

export const sequelize = new Sequelize(
    database,
    "root",
    password,
    {
        host,
        dialect: "mysql"
    }
)

export const dbConnectMySql = async () =>{
    console.log(username);
    try {
        await sequelize.authenticate();
        console.log("MYSQL conexion correcta");
    } catch (error) {
        console.log(error);
        console.log("ERRO: en conexion de mysql");
    }
};

//exports = { sequelize, dbConnectMySql }

//export const mysqlC = { sequelize, dbConnectMySql }