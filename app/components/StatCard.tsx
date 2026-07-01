interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

export function StatCard({ icon, label, value }: StatCardProps) {
    return (
        <div className="bg-neutral-950 border border-white/10 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                    {label}
                </span>
                <div className="text-yellow-400">{icon}</div>
            </div>
            <p className="font-bebas text-4xl text-white">{value}</p>
        </div>
    );
}
