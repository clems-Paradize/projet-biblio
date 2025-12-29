import { get } from "http";
import * as userModel from "../models/user.model.js";
import userSchema from "../schemas/user.schema.js";
import {v4 as uuidv4} from "uuid";
import z from "zod";
import bcrypt from "bcrypt";

const SALT = 12

const hashPassword = async (password) => {
return await bcrypt.hash(password, SALT)
}

export async function getAllUsers(req, res) {
    const users = await userModel.findAllUsers();
    res.json(users)
}

export  async function  getUserById(req, res) {    
    const user = await  userModel.findUserById(req.params.id);
    if (!user){
        returnres.status(404).json({message: "utilisateur non trouvé"});
    }
    res.json(user);
}

export  function deleteById(req,res) {
    const id = Number(req.params.id)
    const users = userModel.deleteById(id);
    if (!users){
        res.status(404).json({message: "Utilisateur non trouvé"})
    }
    res.json(users)
}
    


export async function create(req, res) {
    const {email, password, confirmpassword} = req.body;
    if(!email || !password || !confirmpassword){
        res.status(400).json({message: "Missing properties"})
    }
    if (password != confirmpassword){
        res.status(400).json({message :"password arenn't identical"});
    }

    const user = {
        id: uuidv4(), 
        email, 
        password: await hashPassword(password)
    };

    try{
        const validUser = userSchema.parse(user);

        const userResponse = await userModel.create(validUser)
        if  (userResponse.error) {
            return res.status(400).json(userResponse);
        }
        return res.status(201).json(userResponse);
        }catch(err){
        if (err.name ==="ZodError"){
            return res.status(400).json({error: z.prettifyError(err)});
        }
        res.status(500).json({message : err.message})
    }
}

