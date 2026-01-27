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
        <main className="p-8">
            <h1 className="text-xl font-bold mb-4">Change Password</h1>
            <div className="flex gap-2">
                <input
                    type="password"
                    className="border p-2 rounded w-64"
                    placeholder="New Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    onClick={submit}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update"}
                </button>
            </div>
        </main>
    );
}
