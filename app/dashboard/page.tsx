"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

import AnalysisComponent from "./components/AnalysisComponent";
import GoalTracker from "./components/GoalTracker";
import ActivityFeed from "./components/ActivityFeed";

export default function DashboardPage() {
    const [kpis, setKpis] = useState<any>(null);
    const [trend, setTrend] = useState<any[]>([]);
    const [range, setRange] = useState("7d");
    const [isAdmin, setIsAdmin] = useState(false);

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateMetrics, setSelectedDateMetrics] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [monthlyMetrics, setMonthlyMetrics] = useState<any[]>([]);

    const [isActivityOpen, setIsActivityOpen] = useState(false);

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

    function exportReport() {
        const token = localStorage.getItem("token");
        const { start, end } = getDateRange(range);
        fetch(`/api/reports/export?start=${start}&end=${end}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "report.csv";
                a.click();
            });
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!localStorage.getItem("token")) {
                window.location.href = "/login";
            }
        }

        const token = localStorage.getItem("token");
        const { start, end } = getDateRange(range);

        // Fetch KPIs
        fetch(`/api/metrics/kpis?start=${start}&end=${end}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setKpis(data));

        // Fetch Trends
        fetch(`/api/metrics/trends?start=${start}&end=${end}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch trends");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setTrend(data);
                else setTrend([]);
            })
            .catch(err => {
                console.error("Error fetching trends:", err);
                setTrend([]);
            });
    }, [range]);

    // Fetch monthly metrics for calendar
    useEffect(() => {
        const token = localStorage.getItem("token");
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Get first and last day of current month
        const start = new Date(year, month, 1).toISOString().split("T")[0];
        const end = new Date(year, month + 1, 0).toISOString().split("T")[0];

        fetch(`/api/metrics/trends?start=${start}&end=${end}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMonthlyMetrics(data);
                else setMonthlyMetrics([]);
            })
            .catch(err => console.error("Error fetching monthly metrics:", err));
    }, [currentDate]);

    // Calendar Helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const handleDateClick = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const dateStr = new Date(year, month, day + 1).toISOString().split("T")[0]; // +1 because day is 1-indexed but JS Date needs correct day? Wait. day is 1..31. new Date(y, m, d) is correct. But toISOString might be affected by timezone.
        // Better to match by string format YYYY-MM-DD
        const monthStr = (month + 1).toString().padStart(2, '0');
        const dayStr = day.toString().padStart(2, '0');
        const searchDate = `${year}-${monthStr}-${dayStr}`;

        const metric = monthlyMetrics.find(m => m.date === searchDate);

        if (metric) {
            setSelectedDateMetrics(metric);
            setIsModalOpen(true);
        } else {
            // Optional: Allow adding if no metric? For now just showing details if exist.
            // Or maybe show "No data"
            setSelectedDateMetrics({ date: searchDate, noData: true });
            setIsModalOpen(true);
        }
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    if (!kpis) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-500 font-medium">Loading analytics...</div>
        </div>
    );

    const { days, firstDay } = getDaysInMonth(currentDate);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



    return (
        <main className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsActivityOpen(true)}
                        className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition font-medium text-sm flex items-center gap-2"
                    >
                        📜 Activity Log
                    </button>
                    <a
                        href="/dashboard/add-metric"
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm hover:bg-blue-700 transition font-medium text-sm flex items-center gap-2"
                    >
                        <span>+</span> Add Data
                    </a>
                    <button
                        onClick={exportReport}
                        className="bg-green-600 text-white px-4 py-2 rounded shadow-sm hover:bg-green-700 transition font-medium text-sm"
                    >
                        Export CSV
                    </button>
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
            </div>

            {/* AI Analysis Card */}
            <AnalysisComponent />

            {/* Goal Tracker */}
            <div className="mb-8">
                <GoalTracker
                    currentRevenue={kpis.totalRevenue}
                    currentOrders={kpis.totalOrders}
                    currentCustomers={kpis.totalCustomers}
                />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KpiCard title="Total Revenue" value={`₹${kpis.totalRevenue}`} icon="💸" />
                <KpiCard title="Total Orders" value={kpis.totalOrders} icon="📦" />
                <KpiCard title="Total Customers" value={kpis.totalCustomers} icon="👥" />
                <KpiCard title="Avg. Daily Revenue" value={`₹${kpis.avgDailyRevenue}`} icon="📊" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Chart */}
                <div className="lg:col-span-2 bg-white shadow-sm border rounded-xl p-6">
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

                {/* Calendar View */}
                <div className="bg-white shadow-sm border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Archive</h2>
                        <div className="flex gap-2 text-sm text-gray-600">
                            <button onClick={() => changeMonth(-1)} className="hover:text-black p-1">◀</button>
                            <span className="font-medium min-w-[100px] text-center">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                            <button onClick={() => changeMonth(1)} className="hover:text-black p-1">▶</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square"></div>
                        ))}
                        {Array.from({ length: days }).map((_, i) => {
                            const day = i + 1;
                            const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                            const dayStr = day.toString().padStart(2, '0');
                            const dateStr = `${currentDate.getFullYear()}-${monthStr}-${dayStr}`;
                            const hasData = monthlyMetrics.some(m => m.date === dateStr);

                            return (
                                <button
                                    key={day}
                                    onClick={() => handleDateClick(day)}
                                    className={`aspect-square rounded-full flex items-center justify-center text-sm transition
                                        ${hasData
                                            ? "bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 ring-1 ring-blue-300"
                                            : "text-gray-400 hover:bg-gray-50"
                                        }
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-100 ring-1 ring-blue-300"></div>
                        <span>Data Available</span>
                    </div>
                </div>
            </div>

            {/* Activity Feed Modal */}
            {isActivityOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200 max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={() => setIsActivityOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <ActivityFeed />
                    </div>
                </div>
            )}

            {/* Metric Details Modal */}
            {isModalOpen && selectedDateMetrics && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {new Date(selectedDateMetrics.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">Daily Performance Metrics</p>

                        {selectedDateMetrics.noData ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No data recorded for this day.</p>
                                <a
                                    href="/dashboard/add-metric"
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Add Data Now →
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Revenue</span>
                                    <span className="font-bold text-gray-900">₹{selectedDateMetrics.revenue}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Orders</span>
                                    <span className="font-bold text-gray-900">{selectedDateMetrics.orders}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Customers</span>
                                    <span className="font-bold text-gray-900">{selectedDateMetrics.customers}</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
