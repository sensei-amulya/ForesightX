"use client";

import { useEffect, useState } from "react";

interface User {
    id: string;
    email: string;
    role: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
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

        fetch("/api/users/update-role", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, newRole }),
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed");
                // Optimistic update
                setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
            })
            .catch(() => alert("Failed to update role"));
    }

    if (loading) return <div className="p-8 text-gray-500">Loading users...</div>;
    if (error) return <div className="p-8 text-red-500 bg-red-50 rounded-lg">{error}</div>;

    return (
        <main>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
                <h2 className="font-bold mb-4 text-lg text-gray-900 border-b pb-2">Invite New User</h2>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            className="border border-gray-300 p-2.5 rounded-lg w-full md:w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="user@example.com"
                            value={newUserEmail}
                            onChange={e => setNewUserEmail(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            className="border border-gray-300 p-2.5 rounded-lg w-full md:w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition"
                            value={newUserRole}
                            onChange={e => setNewUserRole(e.target.value)}
                        >
                            <option value="VIEWER">VIEWER</option>
                            <option value="MANAGER">MANAGER</option>
                        </select>
                    </div>
                    <button
                        onClick={createUser}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition shadow-sm w-full md:w-auto"
                    >
                        Create User
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-sm border rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Role</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 text-gray-900">{user.email}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <select
                                        className="border border-gray-200 text-sm p-1.5 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={user.role}
                                        onChange={e => updateRole(user.id, e.target.value)}
                                        disabled={user.role === "ADMIN"}
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
