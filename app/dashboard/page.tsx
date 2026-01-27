"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function DashboardPage() {
    const [kpis, setKpis] = useState<any>(null);
    const [trend, setTrend] = useState<any[]>([]);
    const [range, setRange] = useState("7d");

    function getDateRange(range: string) {
        const end = new Date();
        const start = new Date();

        if (range === "7d") start.setDate(end.getDate() - 7);
        if (range === "30d") start.setDate(end.getDate() - 30);

        return {
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0],
        };
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!localStorage.getItem("token")) {
                window.location.href = "/login";
            }
        }

        const token = localStorage.getItem("token");
        const { start, end } = getDateRange(range);

        // Reset data to trigger loading state if needed, or just let it update
        // setKpis(null); // Optional: if we want to show loading spinner on every switch

        fetch(`/api/metrics/kpis?start=${start}&end=${end}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => setKpis(data));

        fetch(`/api/metrics/trends?start=${start}&end=${end}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch trends");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setTrend(data);
                } else {
                    console.error("Trends data is not an array:", data);
                    setTrend([]);
                }
            })
            .catch(err => {
                console.error("Error fetching trends:", err);
                setTrend([]);
            });
    }, [range]);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
                return;
            }

            try {
                // Simple client-side check. Real security is on the backend.
                // Token payload is the second part (index 1)
                const payload = JSON.parse(atob(token.split(".")[1]));
                if (payload.role === "ADMIN") {
                    setIsAdmin(true);
                }
            } catch (e) {
                console.error("Failed to decode token", e);
            }
        }
    }, []);

    if (!kpis) return <p className="p-6 text-gray-500">Loading analytics...</p>;

    return (
        <main className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    {isAdmin && (
                        <a
                            href="/dashboard/users"
                            className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                        >
                            Manage Users &rarr;
                        </a>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/login";
                        }}
                        className="px-4 py-1 text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 rounded transition-colors"
                    >
                        Logout
                    </button>
                    {["7d", "30d"].map(r => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 py-1 rounded ${range === r
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200"
                                }`}
                        >
                            Last {r === "7d" ? "7 Days" : "30 Days"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KpiCard title="Revenue" value={`₹${kpis.totalRevenue}`} />
                <KpiCard title="Orders" value={kpis.totalOrders} />
                <KpiCard title="Customers" value={kpis.totalCustomers} />
                <KpiCard title="Avg / Day" value={`₹${kpis.avgDailyRevenue}`} />
            </div>

            <div className="bg-white shadow rounded p-4">
                <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
                {trend.length === 0 ? (
                    <p className="text-gray-500 mt-6 h-[300px] flex items-center justify-center">
                        No data for selected range
                    </p>
                ) : (
                    <LineChart width={600} height={300} data={trend}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#2563eb"
                        />
                    </LineChart>
                )}
            </div>
        </main>
    );
}

function KpiCard({ title, value }: { title: string; value: any }) {
    return (
        <div className="bg-white shadow rounded p-4">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
    );
}
