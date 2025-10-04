"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { logout } from "@/app/actions/logout"

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="relative flex justify-between items-center py-4 px-6 bg-white shadow-sm rounded-lg">
            <Link href="/" className="text-2xl font-bold text-gray-800">
                Kepengen ✨
            </Link>

            <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard/add">
                    <Button>+ Tambah Impian</Button>
                </Link>
                <form action={logout}>
                    <Button type="submit" variant="destructive">
                        Keluar
                    </Button>
                </form>
            </div>

            <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-b-lg p-4 flex flex-col gap-3 md:hidden">
                    <Link href="/dashboard/add">
                        <Button className="w-full">+ Tambah Impian</Button>
                    </Link>
                    <form action={logout}>
                        <Button type="submit" variant="destructive" className="w-full">
                            Logout
                        </Button>
                    </form>
                </div>
            )}
        </header>
    )
}
