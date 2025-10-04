import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { Toaster } from "sonner";
import { Header } from "@/components/goals/Header";
import { DashboardStats } from "@/components/goals/DashboardStats";
import { GoalList } from "@/components/goals/GoalsLists";
import { EmptyState } from "@/components/goals/EmptyState";
import { Goal } from "@/types/goals";

export default async function Home() {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            redirect("/login");
        }

        const res = await api.get("/desire", {
            headers: { Cookie: `token=${token}` },
        });

        const goals: Goal[] = res.data;

        return (
            <main className="min-h-screen bg-gray-50">
                <Toaster position="bottom-left" richColors />
                <div className="container mx-auto px-4 py-8">
                    <Header />

                    {goals.length > 0 && <DashboardStats goals={goals} />}

                    {goals.length > 0 ? (
                        <GoalList goals={goals} />
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </main>
        );

    } catch (error: any) {
        console.error("Gagal mengambil data impian:", error?.response?.data || error.message);
        redirect('/login');
    }
}