"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function DashboardNavbar() {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    setRole(payload.role);
                } catch (e) {
                    console.error("Token decode error", e);
                }
            }
        }
    }, []);

    function logout() {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="bg-white border-b sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">F</span>
                                </div>
                                <span className="font-bold text-xl tracking-tight text-gray-900 hidden md:block">
                                    ForesightX
                                </span>
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <NavLink href="/dashboard" active={isActive("/dashboard")}>
                                Overview
                            </NavLink>
                            {role === "ADMIN" && (
                                <NavLink href="/dashboard/users" active={isActive("/dashboard/users")}>
                                    Users
                                </NavLink>
                            )}
                            {role !== "VIEWER" && (
                                <NavLink href="/dashboard/upload" active={isActive("/dashboard/upload")}>
                                    Upload
                                </NavLink>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <UserDropdown role={role} logout={logout} />
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${active
                ? "border-blue-500 text-gray-900"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
        >
            {children}
        </Link>
    );
}

function UserDropdown({ role, logout }: { role: string | null; logout: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setIsOpen(false);
        if (isOpen) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 focus:outline-none"
            >
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                    {role ? role[0] : "U"}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b">
                        <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900">{role || "User"}</p>
                    </div>
                    <Link
                        href="/dashboard/change-password"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setIsOpen(false)}
                    >
                        Change Password
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition font-medium"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
