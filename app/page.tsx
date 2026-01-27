import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-blue-50 to-white">
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Unlock the Future of <br className="hidden sm:block" />
                        <span className="text-blue-600">Business Analytics</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10">
                        ForesightX provides secure, multi-tenant analytics for modern SaaS teams.
                        Visualize trends, manage orders, and drive growth with data-backed decisions.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/signup"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg transition"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/login"
                            className="bg-white hover:bg-gray-50 text-gray-900 font-bold text-lg px-8 py-3 rounded-lg border shadow-sm transition"
                        >
                            Log In
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                Built for high-growth teams
                            </h2>
                            <p className="mt-4 text-xl text-gray-600">
                                Everything you need to understand your business performance.
                            </p>
                        </div>

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
        <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
