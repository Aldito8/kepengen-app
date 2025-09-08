import { Goal } from "@/types/goals";
import Link from "next/link";
import ProgressBarClient from "../ui/progress_bar";

export const GoalCard = ({ goal }: { goal: Goal }) => {
    const percentage = goal.tariff > 0 ? (goal.collected / goal.tariff) * 100 : 0;
    const isAchieved = percentage >= 100;

    function formatCurrency(value?: number | null) {
        if (value == null) return "Rp 0";
        return value.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
        });
    }


    return (
        <Link href={`/detail/${goal.id}`} className="block group">
            <div className="bg-white flex flex-col h-full p-4 border rounded-lg shadow-sm cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300">
                {goal.image && (
                    <img src={goal.image} alt={goal.name_desire} className="w-full h-40 object-cover mb-4 rounded-md" />
                )}
                <div className="flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-gray-800">{goal.name_desire}</h2>
                    <p className="text-sm text-gray-500 mt-1 flex-grow">
                        {goal.description_desire || "Tidak ada deskripsi."}
                    </p>
                    <div className="mt-4">
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-semibold text-green-600">{formatCurrency(goal.collected)}</span>
                            <span className="text-sm text-gray-400">/ {formatCurrency(goal.tariff)}</span>
                        </div>
                        <ProgressBarClient collected={goal.collected} tariff={goal.tariff} />
                        {isAchieved ? (
                            <span className="mt-2 inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Tercapai! 🎉
                            </span>
                        ) : (
                            <span className="mt-2 inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {Math.round(percentage)}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};