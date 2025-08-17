'use client'

import { Button } from "@/components/ui/button";
import { Food } from "@/types/food";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { FoodDialog } from "./foodDialog";
import { Category } from "@/types/category";
import { DialogAction } from "@/components/ui/dialogAction";

interface FoodListProps {
    initialFoods: Array<Food>
    categories: Array<Category>
}

export function FoodList({ initialFoods, categories }: FoodListProps) {
    const [foods, setFoods] = useState(initialFoods);

    return (
        <div className="flex flex-col gap-3 px-4 lg:px-6">
            <FoodDialog setFoods={setFoods} categories={categories} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {
                    foods.map(food => (
                        <FoodCard key={food.id} food={food} setFoods={setFoods} categories={categories} />
                    ))
                }
            </div>
        </div>
    )
}

interface FoodCardProps {
    food: Food
    setFoods: React.Dispatch<React.SetStateAction<Food[]>>
    categories: Array<Category>
}

function FoodCard({ food, setFoods, categories }: FoodCardProps) {
    const [show, setShow] = useState<boolean>(food.available || false)

    function deleteFood() {
        fetch(`/api/foods/${food.id}`, {
            method: "DELETE",
            credentials: "include"
        }).then(async res => {
            await res.json();
            if (res.ok) {
                setFoods(prev => prev.filter(f => f.id !== food.id));
            }
        })
    }

    function handleAvailable() {
        fetch(`/api/foods/available/${food.id}`, {
            method: "PATCH",
            credentials: "include"
        }).then(async res => {
            await res.json();
            if (res.ok) {
                setShow(!show);
            }
        });
    }

    return (
        <div className="bg-secondary p-3 rounded-md flex place-content-between">
            <div className="flex flex-row gap-1.5 items-center">
                <DialogAction
                    title="Are you sure you want to delete this food?"
                    variant={'destructive'}
                    action={() => deleteFood()}
                    buttonText="Delete"
                    trigger={
                        <Button variant={'destructive'} size={"icon"} className="size-7">
                            <Trash2 />
                        </Button>
                    }
                >
                    <p className="font-normal text-sm">
                        This action <span className="font-bold">cannot be undone</span>
                    </p>
                </DialogAction>
                {food.name}
            </div>

            <div className="flex flex-row gap-1.5 items-center">
                <Button size={"icon"} variant={"ghost"} onClick={() => handleAvailable()}>
                    {
                        show ?
                            <Eye />
                            :
                            <EyeOff />
                    }
                </Button>
                <FoodDialog food={food} setFoods={setFoods} setShow={setShow} categories={categories} />
            </div>
        </div>
    )
}