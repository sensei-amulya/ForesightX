"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("/api/users", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (res.status === 403) {
                    throw new Error("You do not have permission to view this page");
                }
                if (!res.ok) throw new Error("Failed to fetch users");
                return res.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    function updateRole(userId: string, newRole: string) {
        const token = localStorage.getItem("token");

        // Optimistic update
        setUsers(users =>
            users.map(u => (u.id === userId ? { ...u, role: newRole } : u))
        );

        fetch("/api/users/update-role", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, newRole }),
        }).catch(() => {
            // Revert on error (could be improved)
            alert("Failed to update role");
        });
    }

    if (loading) return <p className="p-8 text-gray-500">Loading users...</p>;
    if (error) return <p className="p-8 text-red-500">{error}</p>;

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>

            <div className="bg-white shadow rounded overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 border-b font-semibold text-gray-700">
                                Email
                            </th>
                            <th className="p-4 border-b font-semibold text-gray-700">
                                Role
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="p-4 text-gray-900">{u.email}</td>
                                <td className="p-4">
                                    <select
                                        value={u.role}
                                        onChange={e =>
                                            updateRole(u.id, e.target.value)
                                        }
                                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="MANAGER">MANAGER</option>
                                        <option value="VIEWER">VIEWER</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
