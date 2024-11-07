import express from "express";
import cors from  "cors";
//importar la conexion a la DB
import morgan from "morgan";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
//routers
import userRouters from "./rutas/rutes.js";
import medicamentosRouters from "./rutas/rutamedicamentos.js";
import rutapedidos from "./rutas/rutapedidos.js"
import ruatahistorial from "./rutas/rutahistorial.js";
import transaccion from "./rutas/rutatransacciones.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app=express();

//settings
app.set("port", 4000);
app.use(cors());
app.use(express.json());

//Middlewares
app.use(morgan("dev"));

// Configurar Express para servir archivos estáticos desde la carpeta 'public'
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Ruta para servir el archivo 'index.html' desde el directorio 'public'
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use('/user', userRouters);
app.use('/med', medicamentosRouters);
app.use('/datos', rutapedidos, ruatahistorial);
app.use("/transaccion",  transaccion);


app.get('/favicon.ico', (req, res) => res.status(204));
  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
