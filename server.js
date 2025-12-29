import express from "express";
import dotenv from "dotenv";
import middleware from "./midlewares/midlewares.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middleware);

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).send({
    message: err.message || "Internal Server Error",
  });
});



app.listen(PORT, (err) => {  
  if (err) {
    console.error("Error in server setup:", err);
    process.exit(1); // Quitte le process si erreur critique
  }
  console.log("Server listening on Port", PORT);
});
 