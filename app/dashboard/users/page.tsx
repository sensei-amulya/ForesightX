"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserRole, setNewUserRole] = useState("VIEWER");

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

    async function createUser() {
        if (!newUserEmail) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/users/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: newUserEmail, role: newUserRole }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed using create");
                return;
            }

            alert(`User created! Default password: ${data.defaultPassword}`);

            // Refresh list
            const refreshRes = await fetch("/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const refreshData = await refreshRes.json();
            setUsers(refreshData);
            setNewUserEmail(""); // Reset input
        } catch (e) {
            console.error(e);
            alert("An error occurred");
        }
    }

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
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="font-bold mb-4 text-lg">Create New User</h2>
                <div className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                        <input
                            className="border p-2 rounded w-64"
                            placeholder="user@example.com"
                            value={newUserEmail}
                            onChange={e => setNewUserEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Role</label>
                        <select
                            className="border p-2 rounded w-32"
                            value={newUserRole}
                            onChange={e => setNewUserRole(e.target.value)}
                        >
                            <option value="VIEWER">VIEWER</option>
                            <option value="MANAGER">MANAGER</option>
                        </select>
                    </div>
                    <button
                        onClick={createUser}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Create User
                    </button>
                </div>
            </div>

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
