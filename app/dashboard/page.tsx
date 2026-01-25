"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function DashboardPage() {
    const [kpis, setKpis] = useState<any>(null);
    const [trend, setTrend] = useState([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!localStorage.getItem("token")) {
                window.location.href = "/login";
            }
        }

        const token = localStorage.getItem("token");

        fetch("/api/metrics/kpis", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => setKpis(data));

        fetch("/api/metrics/trends", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(setTrend);
    }, []);

    if (!kpis) return <p className="p-6">Loading dashboard...</p>;

    return (
        <main className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KpiCard title="Revenue" value={`₹${kpis.totalRevenue}`} />
                <KpiCard title="Orders" value={kpis.totalOrders} />
                <KpiCard title="Customers" value={kpis.totalCustomers} />
                <KpiCard title="Avg / Day" value={`₹${kpis.avgDailyRevenue}`} />
            </div>

            <div className="bg-white shadow rounded p-4">
                <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
                <LineChart width={600} height={300} data={trend}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" />
                </LineChart>
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
