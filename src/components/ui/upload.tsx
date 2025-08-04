"use client"

import { UploadIcon, X } from "lucide-react";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Input } from "./input";
import { Button } from "./button";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";

interface UploadProps {
    form?: UseFormReturn<any>;
    fieldName?: string;
    onFileSelect?: (file: File | null) => void;
    accept?: string;
    maxSize?: number;
    initialPreview?: string;
}

interface UploadHandle {
    reset: () => void;
}

export const Upload = forwardRef<UploadHandle, UploadProps>(function Upload({
    form,
    fieldName = "image",
    onFileSelect,
    accept = "image/*",
    maxSize = 5 * 1024 * 1024,
    initialPreview
}, ref) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [preview, setPreview] = useState<string | null>(initialPreview || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        reset: () => {
            setPreview(null);
            if (form && fieldName) {
                form.setValue(fieldName, null);
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }));

    const handleImageChange = (file: File) => {
        if (file && file.size <= maxSize) {
            // Se è passato il form, aggiorna il campo
            if (form && fieldName) {
                form.setValue(fieldName, file);
            }

            // Chiama il callback se fornito
            onFileSelect?.(file);

            // Crea preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageChange(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];
            // Verifica tipo file
            if (file.type.startsWith('image/')) {
                handleImageChange(file);
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        setPreview(null);

        // Se è passato il form, pulisce il campo
        if (form && fieldName) {
            form.setValue(fieldName, null);
        }

        // Chiama il callback se fornito
        onFileSelect?.(null);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {preview ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                        src={preview}
                        alt="Upload preview"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={removeImage}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    onClick={triggerFileInput}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragOver
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                >
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG up to {Math.round(maxSize / (1024 * 1024))}MB
                    </p>
                </div>
            )}
            <Input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileInputChange}
                className="hidden"
            />
        </div>
    )
});