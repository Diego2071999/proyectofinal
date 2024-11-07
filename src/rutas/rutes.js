import {Router} from "express";
import { methods as UserControler } from "../controler/usercontroler.js";

const router=Router();
//usuarios
router.get("/user", UserControler.getAllUsers);
router.get("/user/:id", UserControler.getuser);// para buscar un solo dato en especifico
router.post("/user", UserControler.createuser);
router.put("/user/:id", UserControler.updateuser);
router.delete("/user/:id", UserControler.deleteuser);

//roles
router.get("/rol", UserControler.getAllrols);
router.get("/rol/:id", UserControler.getrol);
router.post("/rol", UserControler.createrol);
router.put("/rol/:id", UserControler.updaterol);
router.delete("/rol/:id", UserControler.deleterol)

//usuarios+roles
router.get("/roles", UserControler.getAllUsersWithRoles);
router.get("/roles/:id", UserControler.getuserWithRole);
router.post("/roles", UserControler.createUserWithRole);
router.put("/roles/:id", UserControler.updateUserWithRole);

export default router;