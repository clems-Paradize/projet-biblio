import {db} from "../firebase.js"

const  booksDb = db.collection("books")


export async function findAllBooks(){
    try{
        const snapshot = await booksDb.get();
        return snapshot.docs.map((doc => ({id: doc.id,...doc.data()})));
    }catch  (error){
        if  (error instanceof Error){
            throw new Error (error.message);
        }
        throw  new Error("internal server error");
    }    
}

export async function findBookById(id) {
    const doc = await booksDb.doc(id).get();
    if(!doc.exists){
        return null;
    }   
    
    return {id: doc.id, ...doc.data()};
}

/*
export function deleteBookById(id) {
    const bookIndex = booksDb.findIndex((u) => u.id ===Number(id));
    if (bookIndex === -1) return false;
    booksDb.splice(bookIndex, 1);
    return booksDb;
    //return usersDb.filter ((u)=> u.id === Number(id));
}*/

export async function deleteBookById(id) { 
    return await booksDb.doc(id).delete(); 
}

export async function createBook(book){
    try{
        const snapshot = await booksDb
            .where("isbn", "==", book.isbn)
            .limit(1)
            .get();
            if(!snapshot.empty){
                return {error: "email allready used"}
            }
        const createAt = Date.now()
        const bookResponse = await booksDb.add({...book, createAt})
        return (await bookResponse.get()).id;
    }catch(error){
        throw new Error("Error in user Creation" + error);
    }
}


export async function update(id, book ){
    try{
        const snapshot = await booksDb
            .where("id", "==", id)
            .limit(1)
            .get();
            if(snapshot.empty){
                return {error: "this book does'nt exist"}
            }
        
        const docRef = snapshot.docs[0].ref;
        const updatedAt = Date.now()
        await docRef.update({ 
            ...book,
            updatedAt,
        });
            
        return docRef.id;
        
    }catch(error){
        throw new Error("Error in user update" + error);
    }
}
    