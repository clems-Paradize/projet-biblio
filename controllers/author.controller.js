import { get } from "http";
import * as authorModel from "../models/author.model.js";
import authorSchema from "../schemas/author.schema.js";
import {v4 as uuidv4} from "uuid";
import z from "zod";
import bcrypt from "bcrypt";

const SALT = 12

const hashPassword = async (password) => {
return await bcrypt.hash(password, SALT)
}

export async function getAllAuthors(req, res) {
    const authors = await authorModel.findAllAuthors();
    res.json(authors)
}

export  async function  getAuthorById(req, res) {    
    const author = await  authorModel.findAuthorById(req.params.id);
    if (!author){
        return res.status(404).json({message: "auteur non trouvé"});
    }
    res.json(author);
}

export  function deleteAuById(req,res) {
    const id = req.params.id
    const authors = authorModel.deleteAuthorById(id);
    if (!authors){
        res.status(404).json({message: "Auteur non trouvé"})
    }
    res.json(authors)
}

    


export async function createAu(req, res) {
    const {name, birth_year, nationality, biography} = req.body;
    if(!name){
        res.status(400).json({message: "Missing properties"})
    }

    const author = {
        id: uuidv4(),
        name,
        birth_year,
        nationality, 
        biography
    };

    try{
        const validAuthor = authorSchema.parse(author);

        const authorResponse = await authorModel.create(validAuthor)
        if  (authorResponse.error) {
            return res.status(400).json(authorResponse);
        }
        return res.status(201).json(authorResponse);
        }catch(err){
        if (err.name ==="ZodError"){
            return res.status(400).json({error: z.prettifyError(err)});
        }
        res.status(500).json({message : err.message})
    }
}

export async function updateAu(req, res) {

     try{
        const authorid = await  authorModel.findAuthorById(req.params.id);

        if (!authorid){
            return res.status(404).json({message: "auteur non trouvé"});
        }

        const {name, birth_year, nationality, biography} = req.body;

        const updatedAuthor = {
            name,
            birth_year,
            nationality, 
            biography
        };

   
        const validAuthor = authorSchema.partial().parse(updatedAuthor);

        const authorResponse = await authorModel.update(authorid.id, validAuthor)

        if  (authorResponse.error) {
            return res.status(400).json(authorResponse);
        }

        return res.status(200).json(authorResponse);

        }catch(err){
        if (err.name ==="ZodError"){
            return res.status(400).json({error: z.prettifyError(err)});
        }
        
        res.status(500).json({message : err.message})
    }
}


