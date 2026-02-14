"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [orgName, setOrgName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, orgName }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Signup failed");
            }

            localStorage.setItem("token", data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Visual & Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-slate-900 z-0"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/2 left-10 w-80 h-80 bg-violet-600 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 p-12 text-white max-w-lg">
                    <div className="mb-12">
                        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <span className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">✨</span>
                            ForesightX
                        </Link>
                    </div>
                    <h2 className="text-4xl font-bold mb-6 leading-tight">Join thousands of data-driven companies.</h2>
                    <ul className="space-y-4 text-lg text-slate-300">
                        <li className="flex items-center gap-3">
                            <span className="text-violet-400">✓</span> Real-time analytics dashboard
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-violet-400">✓</span> Multi-tenant organization support
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-violet-400">✓</span> Secure role-based access control
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create account</h2>
                        <p className="mt-2 text-slate-500">
                            Start trying ForesightX for free today.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100 animate-in slide-in-from-top-2">
                            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="orgName">
                                Organization Name
                            </label>
                            <input
                                id="orgName"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Acme Inc."
                                value={orgName}
                                onChange={e => setOrgName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                                Work Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="name@company.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <p className="text-xs text-slate-500">Must be at least 8 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl transition duration-200 shadow-lg shadow-violet-200 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Get Started"}
                        </button>
                    </form>

                    <div className="pt-4 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-violet-600 font-bold hover:text-violet-700 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
