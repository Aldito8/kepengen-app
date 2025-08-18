'use client';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {

            if(username === "" || email === "" || password === ""){
                setError('need username, email and password')
            }
            const response = await api.post('/register', {
                username, email, password,
            });

            if (!response || !response.data) {
                setError('register failed');
            }

            const data = response.data;
            if (data.token) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error during register:', error);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center space-y-8">
            <h1 className="text-4xl font-bold">Register</h1>
            <form onSubmit={handleSubmit} className="flex w-sm flex-col space-y-4">
                <input
                    type="username"
                    placeholder="username"
                    className='px-4 py-2 border rounded-lg'
                    onChange={(e) => setUsername(e.target.value)}
                />
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
                    Register
                </button>
            </form>
            <p className="text-sm text-gray-500">
                Already have an account? <a href="/auth/login" className="text-blue-500 hover:underline">Login here</a>
            </p>
        </div>
    );
}