"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DashboardPage() {
    const [kpis, setKpis] = useState<any>(null);
    const [trend, setTrend] = useState<any[]>([]);
    const [range, setRange] = useState("7d");
    const [isAdmin, setIsAdmin] = useState(false); // Kept for any page-specific logic if needed

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

        fetch(`/api/metrics/kpis?start=${start}&end=${end}`, {
            headers: { Authorization: `Bearer ${token}` },
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
                    setTrend([]);
                }
            })
            .catch(err => {
                console.error("Error fetching trends:", err);
                setTrend([]);
            });
    }, [range]);

    if (!kpis) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-500 font-medium">Loading analytics...</div>
        </div>
    );

    return (
        <main className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>

                <div className="flex bg-white rounded-lg p-1 shadow-sm border">
                    {["7d", "30d"].map(r => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${range === r
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            {r === "7d" ? "Last 7 Days" : "Last 30 Days"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KpiCard title="Total Revenue" value={`₹${kpis.totalRevenue}`} icon="💸" />
                <KpiCard title="Total Orders" value={kpis.totalOrders} icon="📦" />
                <KpiCard title="Total Customers" value={kpis.totalCustomers} icon="👥" />
                <KpiCard title="Avg. Daily Revenue" value={`₹${kpis.avgDailyRevenue}`} icon="📊" />
            </div>

            <div className="bg-white shadow-sm border rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend</h2>
                {trend.length === 0 ? (
                    <div className="flex items-center justify-center h-[350px] bg-gray-50 rounded-lg border border-dashed">
                        <p className="text-gray-500">No data available for this period</p>
                    </div>
                ) : (
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#6B7280"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#6B7280"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </main>
    );
}

function KpiCard({ title, value, icon }: { title: string; value: any; icon: string }) {
    return (
        <div className="bg-white shadow-sm border rounded-xl p-6 hover:shadow-md transition duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <span className="text-2xl">{icon}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
}
