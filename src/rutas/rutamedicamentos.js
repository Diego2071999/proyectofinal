import {Router} from "express";
import { methods as medicamentosControler } from "../controler/medicamentoscontroler.js";

const routermedicamentos=Router();
//usuarios
routermedicamentos.get("/medi", medicamentosControler.getAllMedicamentos);
routermedicamentos.get("/medi/:id", medicamentosControler.getMedicamento);// para buscar un solo dato en especifico
routermedicamentos.post("/medi", medicamentosControler.createMedicamento);
routermedicamentos.put("/medi/:id", medicamentosControler.updateMedicamento);
routermedicamentos.delete("/medi/:id", medicamentosControler.deleteMedicamento);

export default routermedicamentos;