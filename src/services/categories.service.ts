import { Category } from "@/types/category";

export async function getCategories() : Promise<Array<Category>> {
    return await fetch(`${process.env.API_URL}/categories/available`)
        .then(res => res.json())
        .catch(err => console.log(err));
}