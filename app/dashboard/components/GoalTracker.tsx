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
            <div className="mb-4">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span>{icon}</span> {label}
                    </span>
                    <span className="text-xs text-gray-500">
                        {prefix}{current.toLocaleString()} / {isSet ? `${prefix}${target.toLocaleString()}` : "Not set"}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 relative overflow-hidden">
                    <div
                        className={`bg-blue-600 h-2.5 rounded-full transition-all duration-500 ${percentage >= 100 ? "bg-green-500" : ""}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="animate-pulse h-32 bg-gray-100 rounded-xl"></div>;

    const revenueGoal = getGoal("REVENUE");
    const ordersGoal = getGoal("ORDERS");
    const customersGoal = getGoal("CUSTOMERS");

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Monthly Targets 🎯</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    + Set Goals
                </button>
            </div>

            {renderProgressBar("Revenue", currentRevenue, revenueGoal, "💸", "₹")}
            {renderProgressBar("Orders", currentOrders, ordersGoal, "📦")}
            {renderProgressBar("Customers", currentCustomers, customersGoal, "👥")}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold mb-4">Set Monthly Goal</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value as any)}
                                >
                                    <option value="REVENUE">Revenue</option>
                                    <option value="ORDERS">Orders</option>
                                    <option value="CUSTOMERS">Customers</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. 50000"
                                    value={targetValue}
                                    onChange={(e) => setTargetValue(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSetGoal}
                                    disabled={!targetValue}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
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
