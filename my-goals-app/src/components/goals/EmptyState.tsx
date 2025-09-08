import Link from "next/link";
import { Button } from "../ui/button";

export const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center mt-20 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Belum Ada Impian?</h2>
        <p className="text-gray-500 mb-6">Jangan tunda lagi, ayo buat impian pertamamu dan mulai menabung!</p>
        <Link href="/dashboard/add">
            <Button size="lg" className="transform hover:scale-105 transition-transform">
                Buat Impian Pertama
            </Button>
        </Link>
    </div>
);