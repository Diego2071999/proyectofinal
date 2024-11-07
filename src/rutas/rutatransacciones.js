import {Router} from "express";
import { methods as transaccionesControler } from "../controler/transacciones/transacciones.js";

const router=Router();
router.get("/receta", transaccionesControler.getAllRecetas);
router.get("/receta/:id", transaccionesControler.getRecetaById),
router.post("/receta", transaccionesControler.createReceta);
router.put("/receta/:id", transaccionesControler.updateReceta);
router.delete("/receta/:id", transaccionesControler.deleteReceta);

router.get("/recetas", transaccionesControler.getRecetasByPaciente);

router.get("/detalle", transaccionesControler.getAllDetallesPedido);
router.get("/detalle/:id", transaccionesControler.getDetallePedidoById),
router.post("/detalle", transaccionesControler.createDetallePedido);
router.put("/detalle/:id", transaccionesControler.updateDetallePedido);
router.delete("/detalle/:id", transaccionesControler.deleteDetallePedido);

router.get("/pedido", transaccionesControler.obtenerPedidos);
router.get("/pedio/:id", transaccionesControler.obtenerPedidoPorId),
router.post("/pedido", transaccionesControler.crearPedido);
router.put("/pedido/:id", transaccionesControler.actualizarPedido);
router.delete("/pedido/:id", transaccionesControler.eliminarPedido);

export default router;
