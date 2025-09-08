'use client';

import { api } from "@/lib/api";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast, Toaster } from "sonner";
import ProgressBarClient from "@/components/ui/progress_bar";

import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { dateFormat } from "@/lib/dateFormat";

type HistoryItem = {
    id: string;
    amount: number;
    created_at: string;
};

type Goal = {
    id: string;
    name_desire: string;
    description_desire?: string;
    image?: string;
    tariff: number;
    collected: number;
    history: HistoryItem[];
};

function formatCurrency(value?: number | null) {
    if (value == null) return "Rp 0";
    return value.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });
}

const LoadingSkeleton = () => (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-8 w-32" />
        <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
        </div>
    </div>
);

const GoalDetails = ({ data }: { data: Goal }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        {data.image && (
            <img src={data.image} alt={data.name_desire} className="w-full h-64 object-cover mb-6 rounded-lg" />
        )}
        <h1 className="text-4xl font-bold text-gray-800">{data.name_desire}</h1>
        <p className="text-gray-500 mt-2">{data.description_desire || "Tidak ada deskripsi."}</p>

        <div className="mt-6 space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-2xl font-semibold text-green-600">{formatCurrency(data.collected)}</span>
                <span className="text-gray-400">dari {formatCurrency(data.tariff)}</span>
            </div>
            <ProgressBarClient collected={data.collected} tariff={data.tariff} />
        </div>
    </div>
);

const ActionButtons = ({ goalId, onDelete, onAddInstallment }: { goalId: string; onDelete: () => void; onAddInstallment: (amount: number) => Promise<void>; }) => {
    const [installment, setInstallment] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (installment <= 0) {
            toast.error("Jumlah tabungan harus lebih dari nol.");
            return;
        }
        await onAddInstallment(installment);
        setInstallment(0);
        setIsDialogOpen(false);
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 col-span-2 md:col-span-1"><Plus className="mr-2 h-5 w-5" /> Tambah Tabungan</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Tambah Langkah Impian</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <input
                            type="number"
                            placeholder="Masukkan jumlah tabungan"
                            className="px-4 py-2 border rounded-lg w-full text-lg"
                            value={installment || ''}
                            onChange={(e) => setInstallment(Number(e.target.value))}
                            autoFocus
                        />
                        <Button type="submit" size="lg" className="w-full">Simpan</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Link href={`/edit/${goalId}`} className="w-full col-span-2 md:col-span-1">
                <Button size="lg" variant="outline" className="w-full"><Edit className="mr-2 h-5 w-5" /> Edit</Button>
            </Link>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="lg" variant="destructive" className="w-full col-span-2 md:col-span-1"><Trash2 className="mr-2 h-5 w-5" /> Hapus</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>Tindakan ini tidak dapat diurungkan. Impian ini akan dihapus secara permanen.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete} className="bg-red-600">Ya, Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const InstallmentHistory = ({ history }: { history: HistoryItem[] }) => (
    <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Riwayat Tabungan</h2>
        {history.length === 0 ? (
            <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">Belum ada riwayat tabungan. Ayo mulai menabung!</p>
            </div>
        ) : (
            <div className="space-y-4">
                {history.slice().reverse().map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-500 transition hover:shadow-md">
                        <div>
                            <p className="font-semibold text-green-700 text-lg">{formatCurrency(item.amount)}</p>
                            <p className="text-xs text-gray-400">{dateFormat(Number(item.created_at))}</p>
                        </div>
                        <span className="text-green-500 font-bold">+</span>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<Goal | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/desire/${id}`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching desire data:", error);
                toast.error("Gagal memuat detail impian.");
                router.push('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, router]);

    const handleDeleteDesire = async () => {
        toast.promise(api.delete(`/delete-desire/${id}`), {
            loading: 'Menghapus impian...',
            success: () => {
                router.push('/dashboard');
                return "Impian berhasil dihapus!";
            },
            error: "Gagal menghapus impian.",
        });
    };

    const handleAddInstallment = async (amount: number) => {
        if (!data) return;

        const newHistoryItem: HistoryItem = { id: `temp-${Date.now()}`, amount, created_at: new Date().toISOString() };
        const originalData = { ...data };
        const updatedData = {
            ...data,
            collected: data.collected + amount,
            history: [...data.history, newHistoryItem]
        };

        setData(updatedData);
        toast.success(`Berhasil menambahkan ${formatCurrency(amount)}!`);

        try {
            await api.patch(`/installment-desire/${id}`, { installment: amount });
            const response = await api.get(`/desire/${id}`);
            setData(response.data);
        } catch (error) {
            setData(originalData);
            toast.error("Gagal menyimpan tabungan. Perubahan dibatalkan.");
            console.error("Error updating installment:", error);
        }
    };

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!data) {
        return <p>Data tidak ditemukan.</p>;
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Toaster position="top-center" richColors />
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <Link href="/dashboard" className="mb-6 flex space-x-5 items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Link>

                <GoalDetails data={data} />
                <ActionButtons goalId={data.id} onDelete={handleDeleteDesire} onAddInstallment={handleAddInstallment} />
                <InstallmentHistory history={data.history} />
            </div>
        </main>
    );
}