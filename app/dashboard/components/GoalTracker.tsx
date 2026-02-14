"use client";

import { useState, useEffect } from "react";

interface Goal {
    id: string;
    type: "REVENUE" | "ORDERS" | "CUSTOMERS";
    target: number;
    month: string;
}

interface GoalTrackerProps {
    currentRevenue: number;
    currentOrders: number;
    currentCustomers: number;
}

export default function GoalTracker({ currentRevenue, currentOrders, currentCustomers }: GoalTrackerProps) {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<"REVENUE" | "ORDERS" | "CUSTOMERS">("REVENUE");
    const [targetValue, setTargetValue] = useState("");

    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`/api/goals?month=${currentMonth}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setGoals(data);
            }
        } catch (error) {
            console.error("Failed to fetch goals", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetGoal = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/goals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: selectedType,
                    target: parseFloat(targetValue),
                    month: currentMonth,
                }),
            });

            if (res.ok) {
                fetchGoals();
                setIsModalOpen(false);
                setTargetValue("");
            } else {
                alert("Failed to set goal");
            }
        } catch (error) {
            console.error("Error setting goal", error);
        }
    };

    const getGoal = (type: string) => goals.find((g) => g.type === type);

    const renderProgressBar = (label: string, current: number, goal?: Goal, icon?: string, prefix = "") => {
        const target = goal ? goal.target : 0;
        const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
        const isSet = !!goal;

        return (
            <div className="mb-5 last:mb-0">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <span className="text-lg">{icon}</span> {label}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {prefix}{current.toLocaleString()} / {isSet ? `${prefix}${target.toLocaleString()}` : "Not set"}
                    </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 relative overflow-hidden">
                    <div
                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${percentage >= 100 ? "bg-emerald-500" : "bg-violet-600"}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="animate-pulse h-32 bg-slate-50 rounded-xl border border-slate-200"></div>;

    const revenueGoal = getGoal("REVENUE");
    const ordersGoal = getGoal("ORDERS");
    const customersGoal = getGoal("CUSTOMERS");

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Monthly Targets</h2>
                    <p className="text-xs text-slate-500">Track your progress against goals</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm text-violet-600 hover:text-violet-800 font-semibold bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition"
                >
                    + Set Goals
                </button>
            </div>

            <div className="space-y-1">
                {renderProgressBar("Revenue", currentRevenue, revenueGoal, "💸", "₹")}
                {renderProgressBar("Orders", currentOrders, ordersGoal, "📦")}
                {renderProgressBar("Customers", currentCustomers, customersGoal, "👥")}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-1 text-slate-900">Set Monthly Goal</h3>
                        <p className="text-sm text-slate-500 mb-6">Define targets for {new Date().toLocaleString('default', { month: 'long' })}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Goal Type</label>
                                <div className="relative">
                                    <select
                                        className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-500 appearance-none bg-white font-medium text-slate-700"
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value as any)}
                                    >
                                        <option value="REVENUE">Revenue</option>
                                        <option value="ORDERS">Orders</option>
                                        <option value="CUSTOMERS">Customers</option>
                                    </select>
                                    <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">▼</div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Value</label>
                                <input
                                    type="number"
                                    className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-500 font-medium text-slate-900"
                                    placeholder="e.g. 50000"
                                    value={targetValue}
                                    onChange={(e) => setTargetValue(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSetGoal}
                                    disabled={!targetValue}
                                    className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm hover:shadow"
                                >
                                    Save Goal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
