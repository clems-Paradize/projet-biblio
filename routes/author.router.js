import  express from "express";
import{createAu, deleteAuById,  getAllAuthors, getAuthorById, updateAu } from "../controllers/author.controller.js";
import { authenticateToken } from "../midlewares/authentification.js";


const router = express.Router();

router.get("/", getAllAuthors);

router.get("/:id", getAuthorById);

router.post("/",  authenticateToken , createAu);

router.put("/:id", authenticateToken , updateAu);

router.delete("/:id", authenticateToken, deleteAuById );



export default router;