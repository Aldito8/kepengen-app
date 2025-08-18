'use client';

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function Edit() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tariff, setTariff] = useState(0);
    const [data, setData] = useState<any>(null);

    const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await api.put(`/update-desire/${id}`, {
                name_desire: title,
                description_desire: description,
                tariff: tariff,
            });
            if (response.status === 200) {
                toast.success("Goal updated successfully!", {
                    style: {
                        backgroundColor: "#107e31ff",
                        color: "#f9fafb",
                        border: "none",
                        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.5)",
                    },
                });
                router.push(`/detail/${id}`);
            } else {
                console.error("Failed to update desire");
                setError("Failed to update desire.");
            }
        } catch (error) {
            console.error("Error updating desire:", error);
            setError("Error update desire.");
        }
    };

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const response = await api.get(`/desire/${id}`);
                const fetchedData = response.data;
                setData(fetchedData);
                setTitle(fetchedData.name_desire);
                setDescription(fetchedData.description_desire || '');
                setTariff(fetchedData.tariff || 0);
            } catch (error) {
                console.error("Error fetching desire data:", error);
                setError("Failed to fetch data desire.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="w-full flex flex-col items-center justify-center space-y-4 min-h-screen p-5">
            <Toaster position="top-right"/>
            <nav className="w-full absolute top-0 px-20 flex justify-between items-center p-2 bg-gray-100 shadow-md">
                <ul>
                    <Link href={`/detail/${id}`} className="absolute top-0 left-0 flex items-center">
                        <Button variant="secondary" size="icon" className="size-8 m-3">
                            <ChevronLeftIcon />
                        </Button>
                        <span>Detail</span>
                    </Link>
                </ul>
                <ul>
                    <li className="inline-block mr-4">
                        <Link href={"/dashboard/add"}>
                            <Button variant={"ghost"}>Add New Goal</Button>
                        </Link>
                    </li>
                    <li className="inline-block mr-4">
                        <Link href={"/dashboard"}>
                            <Button variant={"ghost"}>Dashboard</Button>
                        </Link>
                    </li>
                </ul>
            </nav>
            <h1 className="text-2xl font-bold w-full text-center">
                Edit Desire
            </h1>

            <form onSubmit={handleSubmitEdit}
                className="flex flex-col mt-6 space-y-4 w-full max-w-md">
                <label htmlFor="title">title</label>
                <input
                    type="text"
                    id="title"
                    className="border p-2 rounded"
                    placeholder="Enter goal title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="description">description</label>
                <textarea
                    id="description"
                    className="border p-2 rounded"
                    placeholder="Enter goal description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label htmlFor="tariff">tariff</label>
                <input
                    type="number"
                    id="tariff"
                    className="border p-2 rounded"
                    placeholder="Enter goal tariff"
                    value={tariff}
                    onChange={(e) => setTariff(Number(e.target.value))} />
                <p>Collected: {(data.collected ? data.collected : 0).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</p>
                <Button type="submit" className="bg-blue-700">Update</Button>
            </form>
        </div>
    )
}