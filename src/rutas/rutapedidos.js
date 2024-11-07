import {Router} from "express";
import { methods as pedidosControler } from "../controler/recetacontroler.js";
import { methods as relaciones } from "../controler/relacionescontroler.js";
import { methods as pedidos } from "../controler/Pedidoscontrolers.js";

const router=Router();
router.get("/fac", pedidosControler.getAllFacturas);
router.get("/fac/:id", pedidosControler.getFacturaById);
router.get('/fac/nit/:nit', pedidosControler.getFacturaByNit);

router.get("/paci", pedidosControler.getAllPacientes);
router.get("/paci/:id", pedidosControler.getPaciente),
router.post("/paci", pedidosControler.createPaciente);
router.put("/paci/:id", pedidosControler.updatePaciente);
router.delete("/paci/:id", pedidosControler.deletePaciente);

router.get("/doc", pedidosControler.getAllDoctores);
router.get("/doc/:id", pedidosControler.getDoctor);
router.post("/doc", pedidosControler.createDoctor);
router.put("/doc/:id", pedidosControler.updateDoctor);
router.delete("/doc/:id", pedidosControler.deleteDoctor);

router.get("/receta", pedidosControler.getAllDetalleRecetas);
router.get("/receta/:id", pedidosControler.getDetalleReceta);
router.post("/receta", pedidosControler.createDetalleReceta);
router.put("/recet/:id", pedidosControler.updateDetalleReceta);
router.delete("/receta/:id", pedidosControler.deleteDetalleReceta);
//---------------------------------------------------------------------------------------------------
router.get("/docpaci", relaciones.getAllDoctorPacientes);
router.get("/docpaci/:id", relaciones.getDoctorPaciente);
router.post("/docpaci", relaciones.createDoctorPaciente);
router.put("/docpaci/:id", relaciones.updateDoctorPaciente);
router.delete("/docpaci/:id", relaciones.deleteDoctorPaciente);

router.get("/recetas", relaciones.getAllRecetas);
router.get("/recetas/:id", relaciones.getReceta);
router.post("/recetas",  relaciones.createReceta);
router.put("/recetas/:id", relaciones.updateReceta);
router.delete("/recetas/:id", relaciones.deleteReceta);

router.get("/detalle", pedidos.getAllDetallePedidos);
router.get("/detalle/:id", pedidos.getDetallePedido);
router.post("/detalle",  pedidos.createDetallePedido);
router.put("/detalle/:id", pedidos.updateDetallePedido);
router.delete("/detalle/:id", pedidos.deleteDetallePedido);

router.get("/pedido", pedidos.getAllPedidos);
router.get("/pedido/:id", pedidos.getPedido);
router.post("/pedido",  pedidos.createPedido);
router.put("/pedido/:id", pedidos.updatePedido);
router.delete("/pedido/:id", pedidos.deletePedido);

export default router;