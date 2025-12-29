import {db} from "../firebase.js"

const  usersDb = db.collection("users")


export async function findAllUsers(){
    try{
        const snapshot = await usersDb.get();
        return snapshot.docs.map((doc => ({id: doc.id,...doc.data()})));
    }catch  (error){
        if  (error instanceof Error){
            throw new Error (error.message);
        }
        throw  new Error("internal server error");
    }
    
    
}

export async function findUserById(id) {
    const doc = await usersDb.doc(id).get();
    if(!doc.exists){
        return null;
    }   
    
    return {id: doc.id, ...doc.data()};
}

export function deleteUserById(id) {
    usersDb.delete((u)=> u.id === Number(id));
}

// correction
export function deleteById(id) {
    const userIndex = usersDb.findIndex((u) => u.id ===Number(id));
    if (userIndex === -1) return false;
    usersDb.splice(userIndex, 1);
    return usersDb;
    //return usersDb.filter ((u)=> u.id === Number(id));
}

export async function create(user ){
    try{
        const snapshot = await usersDb
            .where("email", "==", user.email)
            .limit(1)
            .get();
            if(!snapshot.empty){
                return {error: "email allready used"}
            }
        const createAt = Date.now()
        const userResponse = await usersDb.add({...user, createAt})
        return (await userResponse.get()).id;
    }catch(error){
        throw new Error("Error in user Creation" + error);
    }
    }
    