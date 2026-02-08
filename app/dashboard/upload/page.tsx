"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CsvUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const payload = JSON.parse(atob(base64));
            if (payload.role === "VIEWER") {
                router.push("/dashboard");
            }
        } catch (e) {
            console.error("Token error", e);
        }
    }, [router]);

    async function upload() {
        if (!file) return;
        setLoading(true);

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/metrics/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                alert(`Uploaded ${data.rowsInserted} rows successfully`);
                setFile(null);
            } else {
                alert(data.error || "Upload failed");
            }
        } catch (e) {
            alert("An error occurred during upload");
        } finally {
            setLoading(false);
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <main>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Metrics</h1>

            <div className="bg-white p-8 rounded-xl shadow-sm border max-w-2xl">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Import CSV Data</h2>
                    <p className="text-sm text-gray-500">
                        Upload a CSV file containing <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">date</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">revenue</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">orders</code>, and <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">customers</code> columns.
                    </p>
                </div>

                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400 hover:bg-gray-50 bg-white"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <span className="text-2xl">☁️</span>
                        </div>
                        <div className="text-sm text-gray-600">
                            {file ? (
                                <span className="font-semibold text-gray-900">{file.name}</span>
                            ) : (
                                <>
                                    <span className="font-semibold text-blue-600 cursor-pointer">Click to upload</span> or drag and drop
                                </>
                            )}
                        </div>
                        <p className="text-xs text-gray-400">CSV files up to 10MB</p>
                    </div>
                    <input
                        type="file"
                        accept=".csv"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={upload}
                        disabled={!file || loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                    >
                        {loading ? "Uploading..." : "Upload CSV"}
                    </button>
                </div>
            </div>
        </main>
    );
}
