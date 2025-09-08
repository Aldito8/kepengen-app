import { Goal } from "@/types/goals";
import { GoalCard } from "./GoalCard";

export const GoalList = ({ goals }: { goals: Goal[] }) => (
    <div className="mt-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Daftar Impianku</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
            ))}
        </div>
    </div>
);