"use client";

import { useState } from "react";

export default function ChangePasswordPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit() {
        if (!password) return;
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPassword: password }),
            });

            if (res.ok) {
                alert("Password updated successfully");
                setPassword("");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to update password");
            }
        } catch (e) {
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Security</h1>

            <div className="bg-white p-8 rounded-xl shadow-sm border max-w-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Enter new password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters recommended.</p>
                    </div>
                    <div className="pt-2">
                        <button
                            onClick={submit}
                            disabled={loading || !password}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
