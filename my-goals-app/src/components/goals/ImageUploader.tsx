import { ChangeEvent, useRef } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { ImageIcon, X } from "lucide-react";

export const ImageUploader = ({
    image,
    preview,
    onImageChange,
    onRemoveImage
}: {
    image: File | null;
    preview: string | null;
    onImageChange: (file: File) => void;
    onRemoveImage: () => void;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageChange(e.target.files[0]);
        }
    };

    return (
        <div className="grid w-full items-center gap-2">
            <Label htmlFor="image">Gambar (Opsional)</Label>
            {preview ? (
                <div className="relative group">
                    <img src={preview} alt="Preview Impian" className="w-full h-48 object-cover rounded-lg border" />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={onRemoveImage}
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            ) : (
                <div
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImageIcon className="size-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Klik untuk memilih gambar</p>
                    <input
                        id="image"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            )}
        </div>
    );
};