import express from "express";
import { create } from "../controllers/user.controller.js"; 
import { db } from "../firebase.js";
import bcrypt from "bcrypt"
import dotenv from "dotenv";
import jwt from "jsonwebtoken";




dotenv.config();

const router = express.Router();

const passwordCompare = async (bodyPassword, hashedPassword) => {
    return await bcrypt.compare(bodyPassword, hashedPassword)
};






router.post("/login", async (req, res) => {
    const { email, password } = req.body
    console.log("BODY REÇU :", req.body);

    const  usersDb = db.collection("utilisateur")
    const user = await usersDb.where("email", "==", email).get()
    console.log("EMAIL REÇU :", email);

    if (user.empty) {
        return res.status(404).json({ message: "user not found" })
    }
    const passwordIsok = await passwordCompare(password, user.docs[0].data().password
    );
    if (passwordIsok) {
        const accesToken = process.env.SECRET_ACCESS_TOKEN;
        const refreshToken = process.env.SECRET_REFRESH_TOKEN;
        const token = jwt.sign({
            id: user.docs[0].id
        },
            accesToken,
            {
                expiresIn: '10 min'
            }
        );
        const rtoken = jwt.sign({
            id: user.docs[0].id,
            isAdmin: user.docs[0].data().isAdmin,
        },
            refreshToken,
            {
                expiresIn: '30 min'
            }
        );
        res.cookie("jwt", rtoken,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
            }
        )
        return res.json({ token });
    } else {
        return res.json({ message: "Not the same" })
    }

});

router.post("/refresh", (req, res) => {
    const refreshToken = req.cookies?.jwt
    if (!refreshToken) return res.sendStatus(401);
    
    jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, decoded) => {
        
        if(err){
            console.log(err);
            
        }
        const accesToken = jwt.sign(
            { 
                id: decoded.id,
                isAdmin: decoded.isAdmin,
             },
            process.env.SECRET_ACCESS_TOKEN,
            {
                expiresIn: "10min",
            }
        )
        const rtoken = jwt.sign(
            { 
                id: decoded.id,
                isAdmin: decoded.isAdmin,
             },
        
            process.env.SECRET_REFRESH_TOKEN,
            {
                expiresIn: '30 min'
            }
        );
        res.cookie("jwt", rtoken,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
            }
        )
        console.log(accesToken);
        return res.json({accesToken})
    });

})

router.post("/register", create);

export default router