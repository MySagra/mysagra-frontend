"use client"

import { Button } from "@/components/ui/button"
import { Pencil, PlusCircle } from "lucide-react";
import { UploadImage, UploadImageRef } from "@/components/ui/uploadImage";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "@/types/category";
import { useRef } from "react";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    position: z.string()
        .min(1, "Position is required")
        .refine(val => !isNaN(Number(val)), {
            message: "Required a number"
        }),
    available: z.boolean(),
    image: z
        .instanceof(File)
        .optional()
        .refine((file) => {
            if (!file) return true;
            console.log("Validating file size:", file.size, "bytes");
            return file.size <= 5 * 1024 * 1024; // Max 5MB
        }, "File must be less than 5MB")
        .refine((file) => {
            if (!file) return true;
            return file.size <= 5 * 1024 * 1024; // Max 5MB
        }, "File must be less than 5MB")
        .refine((file) => {
            if (!file) return true;
            return ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
        }, "Only JPG, JPEG and PNG files are allowed"),
})

interface CategoryDialog {
    category?: Category
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>
    setShow?: React.Dispatch<React.SetStateAction<boolean>>
    imageURL?: string
}

export default function CategoryDialog({ category, setCategories, setShow, imageURL }: CategoryDialog) {
    const uploadRef = useRef<UploadImageRef>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: category?.name || "",
            position: category?.position !== undefined ? String(category.position) : "1",
            available: category?.available || true
        }
    })

    function createCategory(values: z.infer<typeof formSchema>) {
        const file = uploadRef.current?.getFile();
        const categoryData = { ...values };

        if (file) {
            categoryData.image = file;
        }

        const { image, ...categoryDataWithoutImage } = categoryData;
        fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryDataWithoutImage),
        }).then(async res => {
            let data = await res.json();
            if (!res.ok) return;
            if (image) {
                data = await (await uploadImage(image, data.id)).json();
            }
            form.reset();
            uploadRef.current?.reset();
            setCategories(prev =>
                [...prev, data].sort((a, b) => Number(a.position) - Number(b.position))
            );
        })
    }

    function updateCategory(values: z.infer<typeof formSchema>) {
        const file = uploadRef.current?.getFile();
        const categoryData = { ...values };

        if (file) {
            categoryData.image = file;
        }

        const { image, ...categoryDataWithoutImage } = categoryData;
        fetch(`/api/categories/${category?.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryDataWithoutImage),
        }).then(async res => {
            let data = await res.json();

            if (!res.ok) return
            if (image) {
                data = await (await uploadImage(image, data.id)).json();
            }
            if (setShow) setShow(data.available);
            setCategories(prev =>
                prev
                    .map(c => c.id === data.id ? { ...c, ...data } : c)
                    .sort((a, b) => Number(a.position) - Number(b.position))
            );
        })
    }

    async function uploadImage(image: File, id: string) {
        const imageFormData = new FormData();
        imageFormData.append('image', image);

        return await fetch(`/api/categories/${id}/image`, {
            method: "PATCH",
            credentials: "include",
            body: imageFormData,
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {
                    category ?
                        <Button size={"icon"} className="size-7" variant="edit">
                            <Pencil />
                        </Button>
                        :
                        <Button className="w-min">
                            <PlusCircle />
                            Create new category
                        </Button>
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {
                            category ? "Update " : "New "
                        }
                        Category
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <CategoryForm
                    form={form}
                    uploadRef={uploadRef}
                    onSubmit={
                        category ? updateCategory : createCategory
                    }
                    category={category}
                    imageURL={imageURL}
                />
            </DialogContent>
        </Dialog>
    )
}

interface CategoryFormProps {
    form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
    uploadRef: React.RefObject<UploadImageRef | null>;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    category?: Category,
    imageURL?: string
}

function CategoryForm({ form, onSubmit, category, imageURL, uploadRef }: CategoryFormProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Restaurant" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is category display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                                <Input placeholder="1" {...field} />
                            </FormControl>
                            <FormDescription>
                                Category display order.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category Image</FormLabel>
                            <FormControl>
                                <UploadImage
                                    ref={uploadRef}
                                    initialPreview={imageURL}
                                    category={category}
                                    onChange={(file: File | undefined) => {
                                        console.log("File changed:", file);
                                        field.onChange(file);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Upload an image for this category (optional, max 5MB). Only JPEG and PNG files are supported.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="available"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                            <FormLabel>Available</FormLabel>
                            <FormControl>
                                <Checkbox
                                    id="available"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="size-5 accent-primary"
                                />
                            </FormControl>
                            <FormDescription>
                                Show category as available.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {
                        category ?
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-500/80 text-white">Edit</Button>
                            :
                            <Button type="submit">Create</Button>
                    }
                </DialogFooter>
            </form>
        </Form>
    )
}