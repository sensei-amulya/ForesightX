import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">F</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">
                            ForesightX
                        </span>
                    </Link>

                    {/* Desktop Navigation (Placeholder for now) */}
                    <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
                        <Link href="#features" className="hover:text-blue-600 transition">
                            Features
                        </Link>
                        <Link href="#pricing" className="hover:text-blue-600 transition">
                            Pricing
                        </Link>
                        <Link href="/about" className="hover:text-blue-600 transition">
                            About
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex gap-4">
                        <Link
                            href="/login"
                            className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 transition"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
