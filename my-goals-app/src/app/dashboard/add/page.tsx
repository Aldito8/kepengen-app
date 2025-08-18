'use client';

import { api } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "@/app/actions/logout";
import { toast, Toaster } from "sonner";

export default function Add() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tariff, setTariff] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState("")

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name_desire', title);
        formData.append('description_desire', description);
        formData.append('tariff', tariff.toString());

        if (image) {
            formData.append('image', image);
        }

        if(title === "" || tariff === 0){
            setError("required title and tariff")
        }

        api.post('/add-desire', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(() => {
            toast.success("Goal added successfully!", {
                style: {
                    backgroundColor: "#107e31ff",
                    color: "#f9fafb",
                    border: "none",
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.5)",
                },
            });
        })
        .catch(error => {
            console.error("Error adding goal:", error);
        })
        .finally(() => {
            setTitle('');
            setDescription('');
            setTariff(0);
            setImage(null);
        });
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center p-4">
            <nav className="w-full fixed top-0 px-20 flex justify-between items-center p-2 bg-gray-100 shadow-md">
                <ul>
                    <h1 className="font-bold font-2xl">Kepengen</h1>
                </ul>
                <ul>
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
            <Toaster position="top-right"/>
            <h1 className="text-4xl font-bold">Add New Goal</h1>
            <p className="mt-4 text-lg">This is the page to add a new goal.</p>
            <p className="mt-2 text-sm text-gray-500">
                Use the form below to create a new goal.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col mt-6 space-y-4 w-full max-w-md">
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
                    onChange={(e) => setTariff(Number(e.target.value))}
                />
                <label htmlFor="image">Image</label>
                <input
                    id="image"
                    className="border p-2 rounded"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {error && <p className="text-red-700 text-sm text-center">{error}</p>}
                <Button type="submit" className="w-full bg-blue-700">Add</Button>
            </form>
        </div>
    );
}