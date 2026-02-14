"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-32 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-violet-200/50 rounded-full blur-3xl -z-10 pointer-events-none opacity-50"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl mx-auto relative z-10"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-8">
                            <span className="bg-white rounded-full px-2 py-0.5 text-xs font-bold border border-violet-200">NEW</span>
                            <span>ForesightX 2.0 is live!</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                            Unlock the Future of <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Business Analytics</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-12 leading-relaxed">
                            ForesightX provides secure, multi-tenant analytics for modern SaaS teams.
                            Visualize trends, manage orders, and drive growth with data-backed decisions.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="/signup"
                                className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-violet-200 transition-all hover:scale-105"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="/login"
                                className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-lg px-8 py-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300"
                            >
                                Log In
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-white relative">
                    <div className="absolute inset-0 bg-slate-50/50 skew-y-3 -z-10 origin-top-left"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
                                Built for high-growth teams
                            </h2>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                                Everything you need to understand your business performance in one place.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon="📈"
                                title="Real-time Analytics"
                                description="Monitor revenue, orders, and customer growth in real-time with beautiful interactive charts."
                            />
                            <FeatureCard
                                icon="🛡️"
                                title="Secure RBAC"
                                description="Granular permissions ensure your data is safe. Role-based access control built-in from day one."
                            />
                            <FeatureCard
                                icon="📂"
                                title="Seamless CSV Import"
                                description="Bulk upload your legacy data with ease. Our powerful importer handles large datasets efficiently."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-8 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
            <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
