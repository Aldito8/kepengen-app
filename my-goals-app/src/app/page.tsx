import { cookies } from "next/headers";
import { apiServer } from "@/lib/api";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProgressBarClient from "@/components/ui/progress_bar";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { logout } from "./actions/logout";

export default async function TestPage() {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            redirect("/login");
        }

        const res = await apiServer.get("/desire", {
            headers: {
                Cookie: `token=${token}`,
            },
        });

        const desire = res.data;
        return (
            
            <div className="w-full flex flex-col items-center justify-center space-y-4">
                <Toaster position="bottom-left"/>
                <nav className="w-full top-0 absolute px-20 flex justify-between items-center p-2 bg-gray-100 shadow-md">
                    <ul>
                        <li>Kepengen</li>
                    </ul>
                    <ul>
                        <li className="inline-block mr-4">
                            <Link href={"/dashboard/add"}>
                                <Button variant={"ghost"} className="hover:bg-gray-200">Add Goal</Button>
                            </Link>
                        </li>
                        <li className="inline-block mr-4">
                            <form action={logout}>
                                <Button
                                    type="submit"
                                    className="bg-red-700"
                                >
                                    Logout
                                </Button>
                            </form>
                        </li>
                    </ul>
                </nav>
                {desire && desire.length > 0 ? (
                    <div className="mt-4 w-full max-w-4xl p-4">
                        <h1 className="mt-2 text-4xl font-bold text-center pb-10">My Goals</h1>
                        <ul className="p-0 mt-2 w-full space-y-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {desire.map((item: any) => (
                                <Link href={`/detail/${item.id}`} key={item.id} className="block" >
                                    <div
                                        className="text-lg flex flex-col p-4 border rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
                                    >
                                        {item.image && <img src={item.image} alt={item.name_desire} className="w-full h-32 object-cover mb-2 rounded" />}
                                        <h2 className="text-lg font-semibold">{item.name_desire}</h2>
                                        {item.description_desire && (
                                            <span className="text-sm text-gray-600">{item.description_desire}</span>
                                        )}
                                        {item.tariff.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                                        {item.collected && (
                                            <span className="text-sm text-green-600">Collected: {item.collected.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>
                                        )}
                                        <ProgressBarClient
                                            collected={item.collected}
                                            tariff={item.tariff}
                                        />
                                        {(item.collected / item.tariff) * 100 >= 100 ? (<span className="text-sm text-blue-600">Goal Achieved!</span>) : (
                                            <span className="text-sm text-red-600">Goal Not Achieved</span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
                        <h1 className="text-4xl font-bold mb-4">Hello!</h1>
                        <p className="text-xl text-gray-600 mb-6">Looks like not goal yet</p>
                        <p className="text-md text-gray-500 mb-8">
                            Let's create a new Goal
                        </p>
                        <Link href={"/dashboard/add"}>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                                Add Your First Goal
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        );
    } catch (error: any) {
        console.error("Error fetching data:", error?.response?.data || error.message);
        redirect('/login');
    }
}