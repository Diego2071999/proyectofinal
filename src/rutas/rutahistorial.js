import {Router} from "express";
import { methods as historialControler } from "../controler/hitorialcontroles.js";

const routerhistorial=Router();

routerhistorial.get("/his", historialControler.getAllData);
routerhistorial.get("/his/:id", historialControler.getById);// para buscar un solo dato en especifico

export default routerhistorial;