"use server"

import { useEffect, useState } from "react";
import CategoriesList from "@/components/admin/components/category/categoriesList"
import { AdminHeader } from "@/components/admin/layout/header"
import { Category } from "@/types/category";
import CategoryDialog from "@/components/admin/components/category/categoryDialog";
import { getCategories } from "@/services/categories.service";

export default async function Food() {
    const categories: Array<Category> = await getCategories();
    const imageURL = `${process.env.API_URL}/uploads/categories`
    return (
        <>
            <AdminHeader title={"Categories management"} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <CategoriesList imageURL={imageURL} initialCategories={categories} />
                    </div>
                </div>
            </div>
        </>
    )
}
