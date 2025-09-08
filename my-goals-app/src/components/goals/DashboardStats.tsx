import { Goal } from "@/types/goals";
import { StatCard } from "./StatCard";

export const DashboardStats = ({ goals }: { goals: Goal[] }) => {
    const totalGoals = goals.length;
    const achievedGoals = goals.filter(goal => goal.collected >= goal.tariff).length;
    const totalCollected = goals.reduce((sum, goal) => sum + goal.collected, 0);

    const formatCurrency = (amount: number) =>
        amount.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <StatCard title="Total Impian" value={totalGoals} color="border-blue-500 bg-blue-50" />
            <StatCard title="Sudah Tercapai" value={achievedGoals} color="border-green-500 bg-green-50" />
            <StatCard title="Total Terkumpul" value={formatCurrency(totalCollected)} color="border-yellow-500 bg-yellow-50" />
        </div>
    );
};