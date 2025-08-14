"use client"

import { Trash, Upload } from "lucide-react"
import { Input } from "./input"
import { useRef, useState, forwardRef, useImperativeHandle } from "react"
import Image from "next/image"
import { Button } from "./button"
import { Category } from "@/types/category"

interface UploadImageProps {
    initialPreview?: string
    category?: Category
}

export interface UploadImageRef {
    getFile: () => File | undefined
    getPreview: () => string
    reset: () => void
}

export const UploadImage = forwardRef<UploadImageRef, UploadImageProps>(
    (
        { initialPreview = "", category }, ref
    ) => {
        const fileInputRef = useRef<HTMLInputElement>(null)
        const [file, setFile] = useState<File | undefined>(undefined);
        const [preview, setPreview] = useState<string>(initialPreview);

        const handleBrowseClick = () => {
            fileInputRef.current?.click()
        }

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            if (file) {
                setFile(file)

                const reader = new FileReader()
                reader.onload = (e) => {
                    setPreview(e.target?.result as string)
                }
                reader.readAsDataURL(file)
            }
        }

        const handleRemoveFile = () => {
            setFile(undefined)
            setPreview("")
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }

        useImperativeHandle(ref, () => ({
            getFile: () => file,
            getPreview: () => preview,
            reset: () => {
                setFile(undefined)
                setPreview("")
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
            }
        }))

        return (
            <div className="space-y-3">
                {
                    preview ?
                        <DisplayImage preview={preview} fileName={file?.name || category?.image || ""} size={file?.size} onRemove={handleRemoveFile} />
                        :
                        <div className="h-44 border-2 rounded-md flex flex-col items-center place-content-center border-dashed transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
                            <Input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <div className="flex flex-col gap-2 items-center">
                                <Upload className="text-primary size-14 transition-transform duration-300 hover:scale-110" />
                                <div className="flex flex-col gap-0.5 items-center">
                                    <h3 className="text-sm font-semibold">Drop you image here, or <span className="text-primary cursor-pointer hover:underline transition-colors duration-200" onClick={handleBrowseClick}>browse</span></h3>
                                    <p className=" text-gray-300 text-xs">Supports: JPG, JPEG, PNG</p>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
    })

UploadImage.displayName = "UploadImage"

interface DisplayImageProp {
    fileName: string,
    size?: number
    preview: string,
    onRemove: () => void
}

function DisplayImage({ fileName, size, preview, onRemove }: DisplayImageProp) {
    return (
        <div className="h-20 flex gap-6 bg-primary/20 p-3 rounded-xs items-center place-content-between 
                       animate-in slide-in-from-top-3 fade-in duration-500">
            <div className="flex flex-row gap-4 h-full">
                <div className="relative w-[100px] overflow-hidden bg-gray-200">
                    <Image
                        src={preview}
                        alt="preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-semibold">{fileName}</h4>
                    {
                        size ?
                            <p className="text-xs text-gray-600">
                                {(size / (1024 * 1000)).toFixed(2)} mb
                            </p>
                            :
                            <></>
                    }
                </div>
            </div>
            <Button
                size={"icon"}
                variant={"outline"}
                onClick={onRemove}
            >
                <Trash />
            </Button>
        </div>
    );
}