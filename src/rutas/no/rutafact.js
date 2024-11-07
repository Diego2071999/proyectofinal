import {Router} from "express";
import { methods as factmethods} from "../controler/factcontroler.js";

const factruta = Router();

factruta.get("/fact", factmethods.getAllFacWithRelations);
factruta.get("/fact/:id", factmethods.getFactura);
factruta.post("/fact", factmethods.createFactura);

factruta.get("/client", factmethods.getAllClientes);
factruta.get("/client/:id", factmethods.getCliente);
export default  factruta;
