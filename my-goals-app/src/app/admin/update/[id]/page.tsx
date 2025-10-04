'use client'

import { api } from "@/lib/api";
import { use, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export default function Edit({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const response = await api.get(`/users/${id}`);
                const fetchedData = response.data;
                const userData = Array.isArray(fetchedData) ? fetchedData[0] : fetchedData;

                if (userData) {
                    setUsername(userData.username);
                    setEmail(userData.email);
                    setRole(userData.role);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to fetch user data.");
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (username === "" || email === "" || role === "") {
                setError('Need username, email, and role');
                return;
            }
            const response = await api.put(`/users/${id}`, {
                username, email, role,
            });
            if (response.status === 200) {
                toast.success("User updated successfully!", {
                    style: {
                        backgroundColor: "#107e31ff",
                        color: "#f9fafb",
                        border: "none",
                        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.5)",
                    },
                });
            } else {
                console.error("Failed to update user");
                setError("Failed to update user.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center space-y-8">
            <h1 className="text-4xl font-bold">User Edit</h1>
            <Toaster position="top-right"/>
            <form onSubmit={handleSubmit} className="flex w-sm flex-col space-y-4">
                <input
                    type="text"
                    placeholder="username"
                    className='px-4 py-2 border rounded-lg'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="email"
                    className='px-4 py-2 border rounded-lg'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="role"
                    className='px-4 py-2 border rounded-lg'
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />
                {error && <p className='text-red-700 text-sm text-center'>{error}</p>}
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-800 transition duration-200"
                >
                    Update User
                </button>
            </form>
        </div>
    );
}