"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CsvUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.role === "VIEWER") {
                // Viewers shouldn't be here.
                // The API will block them, but UI should also redirect/hide.
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

    return (
        <main className="p-8">
            <h1 className="text-xl font-bold mb-4">Upload Metrics CSV</h1>
            <div className="bg-white p-6 rounded shadow max-w-lg">
                <p className="mb-4 text-gray-600 text-sm">
                    Upload a CSV file with columns: date, revenue, orders, customers.
                </p>
                <input
                    type="file"
                    accept=".csv"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        mb-4"
                />
                <button
                    onClick={upload}
                    disabled={!file || loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
                >
                    {loading ? "Uploading..." : "Upload CSV"}
                </button>
            </div>
        </main>
    );
}
