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

    if (loading) return <div className="h-48 bg-gray-50 rounded-xl animate-pulse"></div>;

    if (logs.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border h-full">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
                <p className="text-gray-500 text-sm">No recent activity found.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border h-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity ⚡</h2>
            <div className="space-y-4">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            📝
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{log.action}</p>
                            <p className="text-xs text-gray-500">
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
