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
        <div className="min-h-screen w-full bg-gray-100 text-gray-800 flex items-center justify-center p-4 font-sans">
            <main className="flex w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden">

                <div className="hidden md:flex w-1/2 p-8 lg:p-12 flex-col items-center justify-center text-white bg-gradient-to-br from-green-400 to-teal-500 text-center">
                    <h1 className="text-4xl font-bold mb-3">Selamat Datang!</h1>
                    <p className="mb-8 max-w-xs leading-relaxed">
                        Sudah punya akun? Masuk untuk melanjutkan perjalanan menabung impianmu.
                    </p>
                    <a href="/login" className="border-2 border-white rounded-full px-12 py-3 font-bold uppercase tracking-wider hover:bg-white hover:text-teal-500 transition-colors duration-300">
                        Masuk
                    </a>
                </div>

                <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col items-center justify-center bg-white">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Buat Akun</h1>

                    <p className="text-gray-400 text-sm mb-6">atau gunakan email untuk registrasi</p>

                    <form onSubmit={handleSubmit} className="w-full max-w-sm">
                        <div className="flex flex-col space-y-4">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                className='w-full px-4 py-3 border-none rounded-md bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                                onChange={(e) => setUsername(e.target.value)}
                            />
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

                        <button
                            type="submit"
                            className="w-full mt-6 px-8 py-3 bg-teal-500 text-white font-bold rounded-full uppercase tracking-wider hover:bg-teal-600 transition duration-200 disabled:bg-teal-300"
                        >
                            Daftar
                        </button>
                    </form>
                </div>

            </main>
        </div>
    );
}