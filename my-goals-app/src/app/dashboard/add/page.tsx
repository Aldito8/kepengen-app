'use client';

import { api } from "@/lib/api";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2 } from "lucide-react";
import { ImageUploader } from "@/components/goals/ImageUploader";

export default function AddGoalPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name_desire: '',
        description_desire: '',
        tariff: '',
    });
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (file: File) => {
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        if (preview) URL.revokeObjectURL(preview);
        setImage(null);
        setPreview(null);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name_desire.trim() || !formData.tariff || Number(formData.tariff) <= 0) {
            toast.error("Nama Impian dan Target Dana wajib diisi dengan benar.");
            return;
        }

        setIsSubmitting(true);
        const formPayload = new FormData();
        formPayload.append('name_desire', formData.name_desire);
        formPayload.append('description_desire', formData.description_desire);
        formPayload.append('tariff', formData.tariff);
        if (image) {
            formPayload.append('image', image);
        }

        toast.promise(api.post('/add-desire', formPayload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }), {
            loading: 'Menyimpan impian barumu...',
            success: () => {
                router.push('/dashboard');
                return "Impian baru berhasil dibuat!";
            },
            error: (err) => {
                console.error("Error saat menambah impian:", err);
                return "Gagal membuat impian. Silakan coba lagi.";
            },
            finally: () => {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <Toaster position="top-center" richColors />
            <div className="w-full max-w-lg mb-4">
                <Button asChild variant="ghost">
                    <Link href="/dashboard">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Kembali ke Dashboard
                    </Link>
                </Button>
            </div>

            <Card className="w-full max-w-lg animate-fade-in">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="text-3xl">Buat Impian Baru</CardTitle>
                        <CardDescription>Mimpi besar dimulai dari langkah pertama. Ayo mulai rencanakan impianmu di sini!</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <ImageUploader
                            image={image}
                            preview={preview}
                            onImageChange={handleImageChange}
                            onRemoveImage={handleRemoveImage}
                        />
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="name_desire">Nama Impian</Label>
                            <Input
                                id="name_desire"
                                name="name_desire"
                                type="text"
                                placeholder="Contoh: Motor Baru"
                                value={formData.name_desire}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="description_desire">Deskripsi (Opsional)</Label>
                            <Textarea
                                id="description_desire"
                                name="description_desire"
                                placeholder="Jelaskan detail impianmu..."
                                value={formData.description_desire}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="grid w-full items-center gap-2 mb-4">
                            <Label htmlFor="tariff">Target Dana (Rp)</Label>
                            <Input
                                id="tariff"
                                name="tariff"
                                type="number"
                                placeholder="Contoh: 25000000"
                                value={formData.tariff}
                                onChange={handleInputChange}
                                required
                                min="1"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Menyimpan..." : "Buat Impian"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}