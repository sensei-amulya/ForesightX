"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
    id: string;
    email: string;
    role: string;
    lastActive?: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserRole, setNewUserRole] = useState("VIEWER");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        const token = localStorage.getItem("token");
        fetch("/api/users", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (res.status === 403) throw new Error("Permission denied");
                if (!res.ok) throw new Error("Failed to fetch users");
                return res.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                toast.error(err.message);
                setLoading(false);
            });
    };

    async function createUser() {
        if (!newUserEmail) {
            toast.error("Email is required");
            return;
        }

        const token = localStorage.getItem("token");
        const loadingToast = toast.loading("Inviting user...");

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
                toast.error(data.error || "Failed to create user", { id: loadingToast });
                return;
            }

            toast.success(`User invited! Pwd: ${data.defaultPassword}`, { id: loadingToast, duration: 5000 });

            setIsInviteOpen(false);
            setNewUserEmail("");
            fetchUsers();
        } catch (e) {
            toast.error("An error occurred", { id: loadingToast });
        }
    }

    function updateRole(userId: string, newRole: string) {
        const token = localStorage.getItem("token");

        // Optimistic update
        const originalUsers = [...users];
        setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));

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
                toast.success("Role updated");
            })
            .catch(() => {
                toast.error("Failed to update role");
                setUsers(originalUsers); // Revert
            });
    }

    if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading users...</div>;

    return (
        <main>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <button
                    onClick={() => setIsInviteOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm flex items-center gap-2"
                >
                    <span>+</span> Invite User
                </button>
            </div>

            <div className="bg-white shadow-sm border rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Role</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Last Active</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 text-gray-900 font-medium">{user.email}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : "Never"}
                                </td>
                                <td className="p-4">
                                    <select
                                        className="border border-gray-200 text-sm p-1.5 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
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

            {/* Invite User Modal */}
            {isInviteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Invite New User</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="user@example.com"
                                    value={newUserEmail}
                                    onChange={e => setNewUserEmail(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={newUserRole}
                                    onChange={e => setNewUserRole(e.target.value)}
                                >
                                    <option value="VIEWER">VIEWER</option>
                                    <option value="MANAGER">MANAGER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    onClick={() => setIsInviteOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createUser}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
                                >
                                    Send Invite
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
