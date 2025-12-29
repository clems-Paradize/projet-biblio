import  express from "express";
import{allBooks, createBoo, deleteBooById,  getAllBooks, getBookById, updateBoo } from "../controllers/book.controller.js";
import { authenticateToken } from "../midlewares/authentification.js";


const router = express.Router();

router.get("/books", allBooks);

router.get("/", getAllBooks);

router.get("/:id", getBookById);

router.post("/",  authenticateToken , createBoo);

router.put("/:id", authenticateToken , updateBoo);

router.delete("/:id", authenticateToken, deleteBooById );




export default router;