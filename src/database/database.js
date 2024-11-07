import { Sequelize } from 'sequelize';
import config from "./../config.js";

const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos exitosa');
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

export default sequelize;