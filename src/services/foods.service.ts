import { Food } from "@/types/food";

export async function getFoods(): Promise<Array<Food>> {
    return await fetch(`${process.env.API_URL}/v1/foods`)
        .then(res => res.json())
}

export async function getFoodsAvailable(categoryId: string): Promise<Array<Food>> {
    return await fetch(`${process.env.API_URL}/v1/foods/available/categories/${categoryId}`)
        .then(res => res.json())
}