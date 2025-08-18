'use client';

import { api } from "@/lib/api";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "@/app/actions/logout";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { dateFormat } from "@/lib/dateFormat";
import { toast, Toaster } from "sonner";
import ProgressBarClient from "@/components/ui/progress_bar";

export default function Detail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<any>(null);
    const [installment, setInstallment] = useState(0);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleDeleteDesire = async () => {
        try {
            const response = await api.delete(`/delete-desire/${id}`);
            if (response.status === 200) {
                router.push('/dashboard');
                setData(null);
                console.log("Desire deleted successfully");
            } else {
                console.error("Failed to delete desire");
            }
        } catch (error) {
            console.error("Error deleting desire:", error);
        }
    }

    const updateInstallment = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if(installment === 0){
                setError('need Installment')
            }
            api.patch(`/installment-desire/${id}`, {
                installment
            });
            toast.success("New dream step successfully added", {
                style: {
                    backgroundColor: "#107e31ff",
                    color: "#f9fafb",
                    border: "none",
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.5)",
                },
            });
            setInstallment(0);
        } catch (error) {
            console.error("Error updating installment:", error);
        }
    };

    const goToUpdateDesire = () => {
        router.push(`/edit/${id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/desire/${id}`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching desire data:", error);
            }
        }
        fetchData();
    }, [id]);

    if (!data) {
        return <p>Loading...</p>;
    }

    console.log(data)

    return (
        <div className="">
            <Toaster position="top-right"/>
            <nav className="w-full fixed px-20 flex justify-between items-center p-2 bg-gray-100 shadow-md">
                <ul>
                    <li>Kepengen</li>
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
                    <li className="inline-block mr-4">
                        <form action={logout}>
                            <Button variant={"destructive"}>Logout</Button>
                        </form>
                    </li>
                </ul>
            </nav>
            <div className="flex flex-col md:flex-row h-screen">
                <div className="md:w-2/5 mt-20 md:mt-0 bg-white p-6 md:p-10 bg-gray-200 flex flex-col justify-center items-center border-r border-gray-200 space-y-4 overflow-y-auto" >
                    <div className="border p-10 border-gray-200 rounded-md shadow-lg">
                        <h1 className="text-xl font-bold" > Desire Detail</h1>
                        <div className="space-x-4">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="bg-red-700">
                                        Delete Desire
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Delete this desire
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteDesire}
                                            className="bg-red-700">
                                            Yes, Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button onClick={goToUpdateDesire} className="bg-blue-700">
                                Update Desire
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="bg-green-700">
                                        Dream Step
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle className="text-2xl font-bold mb-4">Dream Step</DialogTitle>
                                    <DialogDescription></DialogDescription>
                                    <DialogContent>
                                        <form onSubmit={updateInstallment}>
                                            <h2 className="text-center py-5 text-xl font-semibold">Add new Step</h2>
                                            <input
                                                type="number"
                                                placeholder="Enter step amount"
                                                className="px-4 py-2 border rounded-lg w-full mb-4"
                                                value={installment}
                                                onChange={(e) => setInstallment(Number(e.target.value))} />
                                            <div className="flex justify-end">
                                                <Button type="submit" className="bg-green-700">Add</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="">
                            <h1 className="py-4 text-2xl font-semibold text-center">{data.name_desire}</h1>
                            {data.image && <img src={data.image} alt={data.name_desire} className="w-full h-64 object-cover mb-2 rounded" />}
                            <p className="text-lg font-semibold py-5">Goals <span className="font-light text-xl">{data.tariff.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span></p>
                            <ProgressBarClient
                                collected={data.collected}
                                tariff={data.tariff}
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                {data.description_desire || ""}
                            </p>
                        </div>
                    </div>
                </div>
                    
                <div className="flex-1 mt-14 bg-gray-50 overflow-y-auto p-4 md:p-10">
                    <h2 className="text-xl font-bold mb-4 text-center">History</h2>
                        {data.history.length === 0 ? 
                        (<h2 className="text-lg font-semibold mb-4 text-center">No History Dream Step Yet.</h2>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {data.history.map((item: any) => (
                                    <div key={item.id} className="mt-2 p-4 border rounded-lg shadow-sm hover:shadow-lg transition duration-200">
                                        <p className="text-xs text-gray-400">Created At: {dateFormat(item.created_at)}</p>
                                        <p className="text-sm text-gray-600">Amount: {item.amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}