import { Food } from "@/types/food";

export async function getFoods(): Promise<Array<Food>> {
    return await fetch(`${process.env.API_URL}/foods`)
        .then(res => res.json())
}

export async function getFoodsAvailable(categoryId: string): Promise<Array<Food>> {
    return await fetch(`${process.env.API_URL}/foods/available/categories/${categoryId}`)
        .then(res => res.json())
}