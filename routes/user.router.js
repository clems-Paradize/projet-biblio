import  express from "express";
import{create, deleteById, getAllUsers, getUserById   } from "../controllers/user.controller.js";
import { authenticateToken } from "../midlewares/authentification.js";


const router = express.Router();

router.get("/", getAllUsers);

router.get("/:userId", authenticateToken ,getUserById);

router.delete("/:id", deleteById );

router.post("/", create);

export default router;