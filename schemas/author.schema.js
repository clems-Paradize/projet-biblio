import z from "zod";



const authorSchema =z.object({
    id: z.uuid(),
    name: z.string().min(2).max(100),
    birth_year: z.number(),
    nationality: z.string(),
    biography: z.string()
}) 

export default authorSchema;
