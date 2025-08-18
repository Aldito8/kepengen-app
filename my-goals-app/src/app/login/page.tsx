'use client';
import { api } from '@/lib/api';
import { error } from 'console';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if(email === "" || password === ""){
                setError('need email and password')
            }

            const response = await api.post('/login', {
                email, password,
            });
            
            if (!response || !response.data) {
                setError('Login failed');
            }

            const data = response.data;
            if (data.token) {
                if(data.userData.role === "admin"){
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center space-y-8">
            <h1 className="text-4xl font-bold">Login</h1>
            <form onSubmit={handleSubmit} className="flex w-sm flex-col space-y-4">
                <input
                    type="text"
                    placeholder="email"
                    className='px-4 py-2 border rounded-lg'
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    className='px-4 py-2 border rounded-lg'
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className='text-red-700 text-sm text-center'>{error}</p>}
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-800 transition duration-200"
                >
                    Login
                </button>
            </form>
            <p className="text-sm text-gray-500">
                Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a>
            </p>
        </div>
    );
}