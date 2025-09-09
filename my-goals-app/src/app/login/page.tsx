'use client';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        try {
            if (email === "" || password === "") {
                setError('Email dan password harus diisi');
                return;
            }

            const response = await api.post('/login', {
                email, password,
            });

            if (!response || !response.data) {
                setError('Login gagal. Silakan coba lagi.');
                return;
            }

            const data = response.data;
            if (data.token) {
                if (data.userData.role === "admin") {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
            } else {
                setError(data.message || 'Email atau password salah.');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Terjadi kesalahan saat login.';
            setError(errorMessage);
            console.error('Error during login:', err);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 text-gray-800 flex items-center justify-center p-4 font-sans">
            <main className="flex w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden">

                <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col items-center justify-center bg-white">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Masuk</h1>

                    <form onSubmit={handleSubmit} className="w-full max-w-sm">
                        <div className="flex flex-col space-y-4">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                className='w-full px-4 py-3 border-none rounded-md bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                className='w-full px-4 py-3 border-none rounded-md bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className='text-red-600 text-sm text-center pt-4'>{error}</p>}

                        <a href="#" className="text-xs text-gray-500 hover:underline my-4 block text-center">Lupa kata sandi anda?</a>

                        <button
                            type="submit"
                            className="w-full mt-2 px-8 py-3 bg-teal-500 text-white font-bold rounded-full uppercase tracking-wider hover:bg-teal-600 transition duration-200 disabled:bg-teal-300"
                        >
                            Masuk
                        </button>
                    </form>
                </div>

                <div className="hidden md:flex w-1/2 p-8 lg:p-12 flex-col items-center justify-center text-white bg-gradient-to-br from-green-400 to-teal-500 text-center">
                    <h1 className="text-4xl font-bold mb-3">Wujudkan Impianmu!</h1>
                    <p className="mb-8 max-w-xs leading-relaxed">Setiap impian besar dimulai dari langkah pertama</p>
                    <a href="/register" className="border-2 border-white rounded-full px-12 py-3 font-bold uppercase tracking-wider hover:bg-white hover:text-teal-500 transition-colors duration-300">
                        Daftar
                    </a>
                </div>

            </main>
        </div>
    );
}