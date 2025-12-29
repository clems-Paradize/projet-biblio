import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path, { join } from "path";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
import userRouter from "../routes/user.router.js";
import authorRouter from "../routes/author.router.js";
import bookRouter from "../routes/book.router.js";
import loginRouter from "../routes/login.router.js";
import indexRouter from "../routes/index.router.js";

 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const accessLogStream = createWriteStream(join(__dirname,'acces.log'),{
    flags: 'a'
});
 

dotenv.config();

export function ejsMiddleware(req, res, next) {
  const app = req.app; // on récupère l'instance Express réelle

  app.set("view engine", "ejs");
  app.set("views", join(process.cwd(), "views"));

  next();
}

const router = express.Router();
router.use(ejsMiddleware);
 
router.use(cors());
router.use(helmet());
router.use(morgan("common",{stream: accessLogStream}));
//router.use(express.json());
router.use(cookieParser());

router.use("/api/users", userRouter);
router.use("/api/authors", authorRouter);
router.use("/api/books", bookRouter);
router.use("/api/auth", loginRouter);
router.use("/", indexRouter);
 


router.use((err, req, res, next) =>{
 
  console.error(err.stack);  
 
  res.status(err.status || 500).send({
 
    message: err.message || 'Erreur serveur interne',
 
  });
 
});
 
export default router;
 