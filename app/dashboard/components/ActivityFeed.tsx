"use client";

import { useEffect, useState } from "react";

interface AuditLog {
    id: string;
    action: string;
    createdAt: string;
    // Add other fields if necessary
}

export default function ActivityFeed() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            const token = localStorage.getItem("token");
            try {
                // Fetching from existing audit API
                const res = await fetch("/api/audits", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setLogs(data.slice(0, 5)); // Limit to 5 items
                }
            } catch (error) {
                console.error("Failed to fetch activity logs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) return <div className="h-48 bg-slate-50 rounded-xl animate-pulse border border-slate-200"></div>;

    if (logs.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-slate-50 rounded-full mb-3">
                    <span className="text-2xl">📭</span>
                </div>
                <h2 className="text-lg font-bold text-slate-800">No Activity</h2>
                <p className="text-slate-500 text-sm">Recent actions will appear here.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-0 h-full">
            <div className="space-y-0 divide-y divide-slate-100">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 shrink-0 border border-violet-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">{log.action}</p>
                            <p className="text-xs text-slate-500">
                                {new Date(log.createdAt).toLocaleString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
