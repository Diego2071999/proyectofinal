import app from './app.js';

// Iniciar el servidor
app.listen(app.get("port"), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get("port")}`);
});
