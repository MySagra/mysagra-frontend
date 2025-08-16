export const dynamic = "force-dynamic";

import { FoodList } from "@/components/admin/components/food/foodlist";
import { AdminHeader } from "@/components/admin/layout/header"
import { getCategories } from "@/services/categories.service";
import { getFoods } from "@/services/foods.service";

export default async function Food() {
    const foods = await getFoods();
    const categories = await getCategories();

    return (
        <>
            <AdminHeader title={"Food management"} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <FoodList initialFoods={foods} categories={categories} />
                    </div>
                </div>
            </div>
        </>
    )
}
