'use client'
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { logout } from "../actions/logout";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface User {
    id: string;
    email: string;
    username: string;
    role: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const handleDeleteUser = async (idToDelete: string) => {
        try {
            const response = await api.delete(`/users/${idToDelete}`);

            if (response.status === 200) {
                setUsers(prevUsers => {
                    if (!prevUsers) return null;
                    return prevUsers.filter(user => user.id !== idToDelete);
                });

                toast.success("User deleted successfully.", {
                    description: `User with ID ${idToDelete} has been successfully deleted.`,
                });
            } else {
                toast.error("Failed to delete user.", {
                    description: "An error occurred while deleting the user data.",
                });
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("An error occurred.", {
                description: "An error occurred on the server.",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/users`);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to fetch data.", {
                    description: "An error occurred while loading the user list.",
                });
            }
        };
        fetchData();
    }, []);

    const openDeleteDialog = (userId: string) => {
        setUserToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    return (
        <>
            <div className="bg-gray-100 min-h-screen p-8 font-sans">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                        <form action={logout}>
                            <Button type="submit" className="bg-red-700 hover:bg-red-800 transition-colors">
                                Logout
                            </Button>
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">ID</th>
                                    <th className="py-3 px-6 text-left">Email</th>
                                    <th className="py-3 px-6 text-left">Username</th>
                                    <th className="py-3 px-6 text-left">Role</th>
                                    <th className="py-3 px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {users && users.length > 0 ? (
                                    users.map((user: User) => (
                                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="py-3 px-6 text-left whitespace-nowrap">
                                                <span className="font-medium text-gray-800">{user.id}</span>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <p className="text-gray-700">{user.email}</p>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <p className="text-gray-700">{user.username}</p>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <span className={`py-1 px-3 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-blue-200 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex space-x-2 justify-center">
                                                    <Link href={`admin/update/${user.id}`}>
                                                        <Button className="bg-blue-700 hover:bg-blue-800 transition-colors">Edit</Button>
                                                    </Link>
                                                    <Button
                                                        variant={'destructive'}
                                                        onClick={() => openDeleteDialog(user.id)}
                                                        className="hover:bg-red-800 transition-colors"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="border-b border-gray-200">
                                        <td colSpan={5} className="py-3 px-6 text-center">
                                            <p>No users yet</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* AlertDialog component */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => userToDelete && handleDeleteUser(userToDelete)}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}