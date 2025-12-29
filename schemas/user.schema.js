import z from "zod";



const userSchema =z.object({
    id: z.uuid(),
    email: z.email(),
    password: z.string().min(8)
}) 

export default userSchema;
