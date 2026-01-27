export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="font-bold text-lg text-gray-900">ForesightX</span>
                        <p className="text-sm text-gray-500 mt-1">
                            © {new Date().getFullYear()} ForesightX Inc. All rights reserved.
                        </p>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900">Terms of Service</a>
                        <a href="#" className="hover:text-gray-900">Twitter</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
