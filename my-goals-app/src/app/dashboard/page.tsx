import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { Toaster } from "sonner";
import { Goal } from "../../types/goals";
import { Header } from "@/components/goals/Header";
import { DashboardStats } from "@/components/goals/DashboardStats";
import { GoalList } from "@/components/goals/GoalsLists";
import { EmptyState } from "@/components/goals/EmptyState";

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

    } catch (error) {
        if (error instanceof Error) {
            console.error("Gagal mengambil data impian:", error.message);
        } else {
            console.error("Gagal mengambil data impian:", error);
        }
    }
}