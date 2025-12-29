import z from "zod";



const userSchema =z.object({
    firstName : z.string().min(3),
    lastName: z.string().min(3),
    password: z.string().min(8),
    age: z.number().min(21),
    uuid: z.uuid(),
    email: z.email(),
    isAdmin: z.boolean(),
}) 

export default userSchema;
