'use client';

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Loader2 } from "lucide-react";

type Goal = {
    name_desire: string;
    description_desire: string;
    tariff: number;
    collected: number;
};

const FormSkeleton = () => (
    <Card className="w-full max-w-lg">
        <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-full" />
        </CardFooter>
    </Card>
);

const EditForm = ({
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    initialCollected
}: {
    formData: Omit<Goal, 'collected'>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
    initialCollected: number;
}) => (
    <Card className="w-full max-w-lg animate-fade-in">
        <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle className="text-3xl">Sunting Impian</CardTitle>
                <CardDescription>Perbarui detail impianmu di sini. Setiap perubahan kecil adalah langkah maju!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="name_desire">Nama Impian</Label>
                    <Input
                        id="name_desire"
                        name="name_desire"
                        type="text"
                        placeholder="Contoh: Liburan ke Bali"
                        value={formData.name_desire}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="description_desire">Deskripsi</Label>
                    <Textarea
                        id="description_desire"
                        name="description_desire"
                        placeholder="Jelaskan mengapa impian ini penting bagimu..."
                        value={formData.description_desire}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="tariff">Target Dana (Rp)</Label>
                    <Input
                        id="tariff"
                        name="tariff"
                        type="number"
                        placeholder="Contoh: 5000000"
                        value={formData.tariff}
                        onChange={handleChange}
                        required
                        min={initialCollected}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Dana terkumpul saat ini: {initialCollected.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
            </CardFooter>
        </form>
    </Card>
);

export default function EditPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [initialData, setInitialData] = useState<Goal | null>(null);
    const [formData, setFormData] = useState({
        name_desire: '',
        description_desire: '',
        tariff: 0,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/desire/${id}`);
                const fetchedData: Goal = response.data;
                setInitialData(fetchedData);
                setFormData({
                    name_desire: fetchedData.name_desire,
                    description_desire: fetchedData.description_desire || '',
                    tariff: fetchedData.tariff || 0,
                });
            } catch (err) {
                console.error("Gagal mengambil data:", err);
                setError("Tidak dapat memuat data impian. Silakan coba lagi.");
                toast.error("Gagal memuat data impian.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'tariff' ? Number(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ((initialData?.collected ?? 0) > formData.tariff) {
            toast.error("Target dana tidak boleh lebih kecil dari dana yang sudah terkumpul.");
            return;
        }
        setIsSubmitting(true);

        toast.promise(api.put(`/update-desire/${id}`, formData), {
            loading: 'Menyimpan perubahan...',
            success: () => {
                router.push(`/detail/${id}`);
                return "Impian berhasil diperbarui!";
            },
            error: (err) => {
                console.error("Gagal memperbarui:", err);
                return "Gagal menyimpan perubahan. Coba lagi.";
            },
            finally: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <Toaster position="top-center" richColors />
            <div className="w-full max-w-lg mb-4">
                <Button asChild variant="ghost">
                    <Link href={`/detail/${id}`}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Kembali ke Detail
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <FormSkeleton />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <EditForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    initialCollected={initialData?.collected ?? 0}
                />
            )}
        </div>
    );
}