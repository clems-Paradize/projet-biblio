import { get } from "http";
import * as bookModel from "../models/book.model.js";
import bookSchema from "../schemas/book.schema.js";
import {v4 as uuidv4} from "uuid";
import z from "zod";
import bcrypt from "bcrypt";

const SALT = 12

const hashPassword = async (password) => {
return await bcrypt.hash(password, SALT)
}

export async function getAllBooks(req, res) {
    const books = await bookModel.findAllBooks();
    res.json(books)
}

export async function getBookById(req, res) {    
    try {
        const id = req.params.id;  // ✔ Correction ici

        console.log("ID REÇU :", id);

        if (!id || id.trim() === "") {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const book = await bookModel.findBookById(id);

        if (!book) {
            return res.status(404).json({ message: "livre non trouvé" });
        }

        return res.json(book);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}


export  function deleteBooById(req,res) {
    const id = req.params.id
    const books = bookModel.deleteBookById(id);
    if (!books){
        res.status(404).json({message: "livre non trouvé"})
    }
    res.json(books)
}

    


export async function createBoo(req, res) {
    const {title, author_id, isbn, published_year, pages, description, available } = req.body;
    if(!title || !author_id || !isbn || !published_year || !pages || !description || !available){
        res.status(400).json({message: "Missing properties"})
    }

    const book = {
        id: uuidv4(),
        title, 
        author_id, 
        isbn,
        published_year, 
        pages, 
        description, 
        available
    };

    try{
        const validbook = bookSchema.parse(book);

        const bookResponse = await bookModel.createBook(validbook) 
        if  (bookResponse.error) {
            return res.status(400).json(bookResponse);
        }
        return res.status(201).json(bookResponse);
        }catch(err){
        if (err.name ==="ZodError"){
            return res.status(400).json({error: z.prettifyError(err)});
        }
        res.status(500).json({message : err.message})
    }
}


export async function updateBoo(req, res) {

     try{
        const bookid = await  bookModel.findBookById(req.params.id);

        if (!bookid){
            return res.status(404).json({message: "livre non trouvé"});
        }

        const {title, author_id, isbn, published_year, pages, description, available } = req.body;

        const updatedbook = {
            title, 
            author_id, 
            isbn, 
            published_year, 
            pages, 
            description, 
            available
        };

   
       const validbook = bookSchema.partial().parse(updatedbook);

        const bookResponse = await bookModel.update(bookid.id, validbook)

        if  (bookResponse.error) {
            return res.status(400).json(bookResponse);
        }

        return res.status(200).json(bookResponse);

        }catch(err){
        if (err.name ==="ZodError"){
            return res.status(400).json({error: z.prettifyError(err)});
        }
        
        res.status(500).json({message : err.message})
    }
}

export async function allBooks(req, res) { 
    const books = await bookModel.findAllBooks(); 
    res.render("books", { books }); 
}

