import z from "zod";

const bookSchema =z.object({
    id: z.uuid(),
    title: z.string().max(200),
    author_id: z.string(),
    isbn: z.string().min(13),
    published_year: z.number().gte(1900).lte(2100),
    pages: z.number().int().positive(),
    description: z.string(),
    available: z.boolean().default(true)
}) 

export default bookSchema;
