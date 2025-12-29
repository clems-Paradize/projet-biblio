import {db} from "../firebase.js"

const  authorsDb = db.collection("authors")


export async function findAllAuthors(){
    try{
        const snapshot = await authorsDb.get();
        return snapshot.docs.map((doc => ({id: doc.id,...doc.data()})));
    }catch  (error){
        if  (error instanceof Error){
            throw new Error (error.message);
        }
        throw  new Error("internal server error");
    }
    
    
}

export async function findAuthorById(id) {
    const doc = await authorsDb.doc(id).get();
    if(!doc.exists){
        return null;
    }   
    
    return {id: doc.id, ...doc.data()};
}


/*
export function deleteAuthorById(id) {
    const authorIndex = authorsDb.findIndex((u) => u.id ===Number(id));
    if (authorIndex === -1) return false;
    authorsDb.splice(authorIndex, 1);
    return authorsDb;
    //return authorsDb.filter ((u)=> u.id === Number(id));
}*/


export async function deleteAuthorById(id) { 
   return await authorsDb.doc(id).delete();
}

export async function create(author ){
    try{
        const snapshot = await authorsDb
            .where("name", "==", author.name)
            .limit(1)
            .get();
            if(!snapshot.empty){
                return {error: "this author allready exist"}
            }
        const createAt = Date.now()
        const authorResponse = await authorsDb.add({...author, createAt})
        return (await authorResponse.get()).id;
    }catch(error){
        throw new Error("Error in user Creation" + error);
    }
}
    

export async function update(id, author ){
    try{
        const snapshot = await authorsDb
            .where("id", "==", id)
            .limit(1)
            .get();
            if(snapshot.empty){
                return {error: "this author does'nt exist"}
            }
        
        const docRef = snapshot.docs[0].ref;
        const updatedAt = Date.now()
        await docRef.update({ 
            ...author, 
            updatedAt,
        });
            
        return docRef.id;
        
    }catch(error){
        throw new Error("Error in user update" + error);
    }
}