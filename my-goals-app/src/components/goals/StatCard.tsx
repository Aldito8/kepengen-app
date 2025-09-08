export const StatCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => (
    <div className={`p-6 rounded-xl shadow-lg border-l-4 ${color}`}>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
);